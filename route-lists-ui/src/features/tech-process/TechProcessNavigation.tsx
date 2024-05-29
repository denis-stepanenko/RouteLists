import { Link, useParams } from 'react-router-dom'
import { Menu, MenuItem } from 'semantic-ui-react'

export default function TechProcessNavigation() {
    const { id } = useParams();
    const location = window.location.toString();

    return (
        <Menu vertical style={{width:'260px'}}>
            <MenuItem as={Link} to={'/techProcessDetails/' + id} active={location.includes('/techProcessDetails/')}>Общее</MenuItem>
            <MenuItem as={Link} to={'/techProcessOperations/' + id} active={location.includes('/techProcessOperations/')}>Операции</MenuItem>
            <MenuItem as={Link} to={'/techProcessDocuments/' + id} active={location.includes('/techProcessDocuments/')}>Документы по изготовлению и настройке</MenuItem>
            <MenuItem as={Link} to={'/techProcessPurchasedProducts/' + id} active={location.includes('/techProcessPurchasedProducts/')}>Комплектовочная ведомость по изготовлению и настройке</MenuItem>
        </Menu>
    )
}
