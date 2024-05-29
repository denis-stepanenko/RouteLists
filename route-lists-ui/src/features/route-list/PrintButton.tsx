import axios from 'axios'
import { Link } from 'react-router-dom'
import { Dropdown } from 'semantic-ui-react'

interface Props {
    routeListId: number
}

const PrintButton = ({routeListId} : Props) => (
        <Dropdown text='Печать' direction='left' className='icon' icon='print' button labeled>
        <Dropdown.Menu>
            <Dropdown.Item text='Маршрутный лист на детали (Приложение 1)' as={Link} to={`${axios.defaults.baseURL}/Report/GetAnnex1Report?id=${routeListId}&format=pdf`} target='_blank'/>
            <Dropdown.Item text='Маршрутный лист на детали (Приложение 2)' as={Link} to={`${axios.defaults.baseURL}/Report/GetAnnex2Report?id=${routeListId}&format=pdf`} target='_blank'/>
            <Dropdown.Item text='Маршрутный лист на детали (Приложение 3)' as={Link} to={`${axios.defaults.baseURL}/Report/GetAnnex3Report?id=${routeListId}&format=pdf`} target='_blank'/>
            <Dropdown.Item text='Маршрутный лист на детали (Приложение 5)' as={Link} to={`${axios.defaults.baseURL}/Report/GetAnnex5Report?id=${routeListId}&format=pdf`} target='_blank'/>
            <Dropdown.Item text='Маршрутный лист на ИВУК' as={Link} to={`${axios.defaults.baseURL}/Report/GetRouteListForIVUKReport?id=${routeListId}&format=pdf`} target='_blank'/>
        </Dropdown.Menu>
    </Dropdown>
    )

export default PrintButton