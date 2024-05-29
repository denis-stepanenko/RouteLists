import { useEffect, useRef, useState } from 'react'
import { Button, Form, Icon, Pagination, Table } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import agent from '../../app/agent';
import { User } from '../../app/models/User';
import Spinner from '../../app/components/Spinner';
import ConfirmDelete from '../../app/components/ConfirmDelete';

export default observer(function Users() {
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [itemForDeletingId, setItemForDeletingId] = useState('');

    const [items, setItems] = useState<User[]>([]);

    const { filter, saveScrollPosition, pageNumber, setPageNumber, setFilter } = userStore;
    const [totalPages, setTotalPages] = useState(0);
    const filterRef = useRef<any>();

    useEffect(() => userStore.restoreParameters(loadItems), []);

    useEffect(() => userStore.restoreScrollPosition(items), [items])

    useEffect(() => userStore.load(loadItems), [pageNumber, filter]);

    const loadItems = async () => {
        setLoading(true);

        agent.Users.list(pageNumber, filter)
            .then(result => {
                setItems(result.data);
                setTotalPages(result.pagination.totalPages);
            })
            .finally(() => setLoading(false));
    }

    function handleFilter() {
        setPageNumber(1);
        setFilter(filterRef.current.value);
    }

    async function handleDelete() {
        setLoading(true);

        agent.Users.delete(itemForDeletingId)
            .then(() => loadItems())
            .finally(() => setLoading(false));
    }

    function handleChangePage(page: number) {
        if (page > 0)
            setPageNumber(page);
    }

    if (loading) return <Spinner />

    return (
        <div>
            {isLoggedIn && (
                <Button as={NavLink}
                    to='/createUser'
                    content='Добавить'
                    positive
                    style={{ marginBottom: 10 }} />
            )}

            <ConfirmDelete
                onClose={() => setDeleting(false)}
                onOpen={() => setDeleting(true)}
                isOpen={deleting}
                onDelete={handleDelete} />

            <Form onSubmit={handleFilter} autoComplete="off">
                <Form.Input fluid icon='search' placeholder='Поиск' defaultValue={filter} ref={filterRef} />
            </Form>

            <Table celled size='small'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={1}></Table.HeaderCell>
                        <Table.HeaderCell>Подразделение</Table.HeaderCell>
                        <Table.HeaderCell>Имя пользователя</Table.HeaderCell>
                        <Table.HeaderCell>Наименование</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        items.map(x => (
                            <Table.Row key={x.id}>
                                <Table.Cell>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Button as={NavLink}
                                            to={`/users/${x.id}`}
                                            onClick={saveScrollPosition} positive icon>
                                            <Icon name='edit' />
                                        </Button>

                                        <Button as={NavLink}
                                            to={`/users/changePassword/${x.id}`}
                                            onClick={saveScrollPosition} icon>
                                            <Icon name='lock' />
                                        </Button>

                                        {isLoggedIn && (
                                            <Button icon onClick={() => {
                                                setItemForDeletingId(x.id);
                                                setDeleting(true);
                                            }}>
                                                <Icon name='delete' />
                                            </Button>
                                        )}

                                    </div>
                                </Table.Cell>
                                <Table.Cell>{x.department}</Table.Cell>
                                <Table.Cell>{x.username}</Table.Cell>
                                <Table.Cell>{x.name}</Table.Cell>
                                
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>

            <Pagination
                totalPages={totalPages}
                activePage={pageNumber}
                onPageChange={(_e, { activePage }) => handleChangePage(Number(activePage))}
            />
        </div>
    )
})
