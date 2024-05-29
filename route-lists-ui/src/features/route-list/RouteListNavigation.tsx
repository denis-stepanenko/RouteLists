import { Link, useParams } from 'react-router-dom'
import { Menu, MenuItem } from 'semantic-ui-react'

export default function RouteListNavigation() {
    const { id } = useParams();
    const location = window.location.toString();

    return (
        <>
            <Menu vertical style={{ width: '260px' }}>

                <MenuItem as={Link} to={'/routeListDetails/' + id} active={location.includes('/routeListDetails/')}>Общее</MenuItem>
                <MenuItem as={Link} to={'/routeListOperations/' + id} active={location.includes('/routeListOperations/')}>Операции</MenuItem>
                <MenuItem as={Link} to={'/routeListDocuments/' + id} active={location.includes('/routeListDocuments/')}>Документы по изготовлению и настройке</MenuItem>
                <MenuItem as={Link} to={'/routeListFramelessComponents/' + id} active={location.includes('/routeListFramelessComponents/')}>Информация по бескорпусным комплектующим</MenuItem>
                <MenuItem as={Link} to={'/routeListReplacedComponents/' + id} active={location.includes('/routeListReplacedComponents/')}>Замена комплектующих</MenuItem>
                <MenuItem as={Link} to={'/routeListModifications/' + id} active={location.includes('/routeListModifications/')}>Выполненные доработки</MenuItem>
                <MenuItem as={Link} to={'/routeListComponents/' + id} active={location.includes('/routeListComponents/')}>Комплектация изделия</MenuItem>
                <MenuItem as={Link} to={'/routeListRepairs/' + id} active={location.includes('/routeListRepairs/')}>Ремонты</MenuItem>
            </Menu>
        </>
    )
}
