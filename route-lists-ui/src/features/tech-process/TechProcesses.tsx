import { useEffect, useRef, useState } from 'react'
import { Button, Form, Icon, Pagination, Table } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import agent from '../../app/agent';
import { TechProcess } from '../../app/models/TechProcess';
import Spinner from '../../app/components/Spinner';
import ConfirmDelete from '../../app/components/ConfirmDelete';

export default observer(function TechProcesses() {
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [itemForDeletingId, setItemForDeletingId] = useState(0);

    const [items, setItems] = useState<TechProcess[]>([]);

    const { techProcessStore } = useStore();
    const { filter, saveScrollPosition, pageNumber, setPageNumber, setFilter } = techProcessStore;
    const [totalPages, setTotalPages] = useState(0);
    const filterRef = useRef<any>();

    useEffect(() => techProcessStore.restoreParameters(loadItems), []);

    useEffect(() => techProcessStore.restoreScrollPosition(items), [items])

    useEffect(() => techProcessStore.load(loadItems), [pageNumber, filter]);

    const loadItems = async () => {
        setLoading(true);

        agent.TechProcesses.list(pageNumber, filter)
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

        agent.TechProcesses.delete(itemForDeletingId)
            .then(() => loadItems())
            .finally(() => setLoading(false));
    }

    function handleChangePage(page: number) {
        if (page > 0)
            setPageNumber(page);
    }

    async function handleConfirmOrUnconfirm(id: number) {
        setLoading(true);

        agent.TechProcesses.confirmOrUnconfirm(id)
            .then(() => loadItems())
            .finally(() => setLoading(false));
    }

    if (loading) return <Spinner />

    return (
        <div>
            {isLoggedIn && (
                <Button as={NavLink}
                    to='/createTechProcess'
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
                        <Table.HeaderCell>Код</Table.HeaderCell>
                        <Table.HeaderCell>Наименование</Table.HeaderCell>
                        <Table.HeaderCell>Описание</Table.HeaderCell>
                        <Table.HeaderCell>Создатель</Table.HeaderCell>
                        <Table.HeaderCell>Утверждение</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        items.map(x => (
                            <Table.Row key={x.id}>
                                <Table.Cell>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Button as={NavLink}
                                            to={`/techProcessDetails/${x.id}`}
                                            onClick={saveScrollPosition} positive icon>
                                            <Icon name='edit' />
                                        </Button>

                                        {isLoggedIn && (
                                            <>
                                                <Button icon onClick={() => {
                                                    setItemForDeletingId(x.id);
                                                    setDeleting(true);
                                                }}>
                                                    <Icon name='delete' />
                                                </Button>
                                                <Button icon onClick={() => handleConfirmOrUnconfirm(x.id)}>
                                                    <Icon name='check square' />
                                                </Button>
                                            </>
                                        )}

                                    </div>
                                </Table.Cell>
                                <Table.Cell>{x.productCode}</Table.Cell>
                                <Table.Cell>{x.productName}</Table.Cell>
                                <Table.Cell>{x.description}</Table.Cell>
                                <Table.Cell>{x.creatorName}</Table.Cell>
                                <Table.Cell>{x.confirmUserName}</Table.Cell>
                                
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
