import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react'
import { Button, Form, Icon, Pagination, Table } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import agent from '../../app/agent';
import { RouteList } from '../../app/models/RouteList';
import Spinner from '../../app/components/Spinner';
import ConfirmDelete from '../../app/components/ConfirmDelete';
import SelectDepartment from '../../app/components/SelectDepartment';

export default observer(function RouteLists() {
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [itemForDeletingId, setItemForDeletingId] = useState(0);

    const [items, setItems] = useState<RouteList[]>([]);

    const { routeListStore } = useStore();
    const { filter, departmentFilter, setDepartmentFilter, saveScrollPosition, pageNumber, setPageNumber, setFilter } = routeListStore;
    const [totalPages, setTotalPages] = useState(0);
    const filterRef = useRef<any>();

    useEffect(() => routeListStore.restoreParameters(loadItems), []);

    useEffect(() => routeListStore.restoreScrollPosition(items), [items])

    useEffect(() => routeListStore.load(loadItems), [pageNumber, filter, departmentFilter]);

    const loadItems = async (pageNumber: number, filter: string, departmentFilter: number | null) => {
        setLoading(true);

        try {
            let result = null;

            if (departmentFilter)
                result = await agent.RouteLists.listWithDepartment(pageNumber, filter, departmentFilter);
            else
                result = await agent.RouteLists.list(pageNumber, filter);

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

    function handleDepartmentFilter(department: number | null) {
        setPageNumber(1);
        setFilter('');
        setDepartmentFilter(department);
    }

    async function handleDelete() {
        setLoading(true);

        agent.RouteLists.delete(itemForDeletingId)
            .then(() => {
                loadItems(pageNumber, filter, departmentFilter);
            })
            .finally(() => setLoading(false));
    }

    async function handleDuplicate(id: number, number: string) {
        setLoading(true);

        try {
            var newNumber = await agent.RouteLists.getNewNumber(userStore.user?.department!);
            await agent.RouteLists.duplicate(id, newNumber.toString());
            await loadItems(pageNumber, filter, departmentFilter);
            toast.info(`Маршрутный лист "${number}" продублирован с номером "${newNumber}"`);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    function handleChangePage(page: number) {
        if (page > 0)
            setPageNumber(page);
    }

    if (loading) return <Spinner />

    return (
        <div>
            {isLoggedIn && (
                <div style={{ marginBottom: 10 }}>
                    <Button as={NavLink}
                        to='/createRouteList'
                        content='Добавить'
                        positive
                    />

                    <Button as={NavLink}
                        to='/createRouteListByTechProcess'
                        content='Создать на основе шаблона'
                        positive
                    />
                </div>
            )}

            <ConfirmDelete
                onClose={() => setDeleting(false)}
                onOpen={() => setDeleting(true)}
                isOpen={deleting}
                onDelete={handleDelete} />

            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '100%' }}>
                    <Form onSubmit={handleFilter} autoComplete="off">
                        <Form.Input fluid icon='search' placeholder='Поиск' defaultValue={filter} ref={filterRef} />
                    </Form>
                </div>

                <div style={{ width: '300px' }}>
                    <SelectDepartment
                        item={departmentFilter}
                        onChange={(x) => {
                            handleDepartmentFilter(x)
                        }} />
                </div>

            </div>

            <Table celled size='small'>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell width={1}></Table.HeaderCell>
                        <Table.HeaderCell>Номер</Table.HeaderCell>
                        <Table.HeaderCell>Дата</Table.HeaderCell>
                        <Table.HeaderCell>Артикул</Table.HeaderCell>
                        <Table.HeaderCell>Наименование</Table.HeaderCell>
                        <Table.HeaderCell>Цех</Table.HeaderCell>
                        <Table.HeaderCell>Заводской номер</Table.HeaderCell>
                        <Table.HeaderCell>Группа направления деятельности</Table.HeaderCell>
                        <Table.HeaderCell>Направление деятельности</Table.HeaderCell>
                        <Table.HeaderCell>Этап</Table.HeaderCell>
                        
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        items.map(x => (
                            <Table.Row key={x.id}>
                                <Table.Cell>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Button
                                            as={NavLink}
                                            to={`/routeListDetails/${x.id}`}
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
                                                <Button icon onClick={() => handleDuplicate(x.id, x.number)}>
                                                    <Icon name='clone' />
                                                </Button>
                                            </>
                                        )}

                                    </div>
                                </Table.Cell>
                                <Table.Cell>{x.number}</Table.Cell>
                                <Table.Cell>{x.date?.split('T')[0]}</Table.Cell>
                                <Table.Cell>{x.productCode}</Table.Cell>
                                <Table.Cell>{x.productName}</Table.Cell>
                                <Table.Cell>{x.department}</Table.Cell>
                                <Table.Cell>{x.factoryNumber}</Table.Cell>
                                <Table.Cell>{x.groupName}</Table.Cell>
                                <Table.Cell>{x.direction}</Table.Cell>
                                <Table.Cell>{x.stage}</Table.Cell>
                                
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
