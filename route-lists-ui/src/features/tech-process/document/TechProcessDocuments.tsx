import { useEffect, useRef, useState } from 'react'
import { Button, Form, Grid, Icon, Pagination, Table } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { NavLink, useParams } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import agent from '../../../app/agent';
import { TechProcessDocument } from '../../../app/models/TechProcessDocument';
import TechProcessNavigation from '../TechProcessNavigation';
import Spinner from '../../../app/components/Spinner';
import ConfirmDelete from '../../../app/components/ConfirmDelete';

export default observer(function TechProcessDocuments() {
    const { id } = useParams();
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [itemForDeletingId, setItemForDeletingId] = useState(0);

    const [items, setItems] = useState<TechProcessDocument[]>([]);

    const { techProcessDocumentStore } = useStore();
    const { filter, saveScrollPosition, pageNumber, setPageNumber, setFilter } = techProcessDocumentStore;
    const [totalPages, setTotalPages] = useState(0);
    const filterRef = useRef<any>();

    useEffect(() => techProcessDocumentStore.restoreParameters(loadItems), []);

    useEffect(() => techProcessDocumentStore.restoreScrollPosition(items), [items])

    useEffect(() => techProcessDocumentStore.load(loadItems), [pageNumber, filter]);
    
    const loadItems = async () => {
        setLoading(true);

        try {
            const result = await agent.TechProcessDocuments.list(Number(id), pageNumber, filter);
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

        agent.TechProcessDocuments.delete(itemForDeletingId)
            .then(() => loadItems())
            .finally(() => setLoading(false));
    }

    function handleChangePage(page: number) {
        if (page > 0)
            setPageNumber(page);
    }

    if (loading) return <Spinner />

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={3}>
                    <TechProcessNavigation />
                </Grid.Column>

                <Grid.Column width={12}>
                    {isLoggedIn && (
                        <Button as={NavLink}
                            to={'/createTechProcessDocument/' + id}
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
                                {isLoggedIn && <Table.HeaderCell width={1}></Table.HeaderCell>}
                                <Table.HeaderCell>Наименование</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                items.map(x => (
                                    <Table.Row key={x.id}>
                                         {isLoggedIn && (
                                            <Table.Cell>
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <Button as={NavLink} to={`/updateTechProcessDocument/${id}/${x.id}`}
                                                        onClick={saveScrollPosition} positive icon>
                                                        <Icon name='edit' />
                                                    </Button>


                                                    <Button icon onClick={() => {
                                                            setItemForDeletingId(x.id);
                                                            setDeleting(true);
                                                        }}>
                                                        <Icon name='delete' />
                                                    </Button>


                                                </div>
                                            </Table.Cell>
                                        )}
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
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
})
