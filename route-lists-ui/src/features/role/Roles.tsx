import { useEffect, useRef, useState } from 'react'
import { Button, Form, Icon, Pagination, Table } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import agent from '../../app/agent';
import { Role } from '../../app/models/Role';
import Spinner from '../../app/components/Spinner';
import ConfirmDelete from '../../app/components/ConfirmDelete';

export default observer(function Roles() {
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [itemForDeletingId, setItemForDeletingId] = useState('');

    const [items, setItems] = useState<Role[]>([]);

    const { roleStore } = useStore();
    const { filter, saveScrollPosition, pageNumber, setPageNumber, setFilter } = roleStore;
    const [totalPages, setTotalPages] = useState(0);
    const filterRef = useRef<any>();
    
    useEffect(() => roleStore.restoreParameters(loadItems), []);

    useEffect(() => roleStore.restoreScrollPosition(items), [items])

    useEffect(() => roleStore.load(loadItems), [pageNumber, filter]);

    const loadItems = async () => {
        setLoading(true);

        try {
            const result = await agent.Roles.list(pageNumber, filter);
            setItems(result.data);
            setTotalPages(result.pagination.totalPages);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    function handleFilter() {
        setPageNumber(1);
        setFilter(filterRef.current.value);
    }

    async function handleDelete() {
        setLoading(true);

        agent.Roles.delete(itemForDeletingId)
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
                    to='/createrole'
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
                                            to={`/roles/${x.id}`}
                                            onClick={saveScrollPosition} positive icon>
                                            <Icon name='edit' />
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
