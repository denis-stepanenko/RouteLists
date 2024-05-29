import axios from 'axios'
import { Link } from 'react-router-dom'
import { Dropdown } from 'semantic-ui-react'

interface Props {
    routeListId: number
}

const DownloadButton = ({routeListId} : Props) => (
        <Dropdown text='Скачать' direction='left' className='icon' icon='download' button labeled>
        <Dropdown.Menu>
            <Dropdown.Item text='Маршрутный лист на детали (Приложение 1)' as={Link} to={`${axios.defaults.baseURL}/Report/GetAnnex1Report?id=${routeListId}&format=docx`} target='_blank'/>
            <Dropdown.Item text='Маршрутный лист на ИВУК' as={Link} to={`${axios.defaults.baseURL}/Report/GetRouteListForIVUKReport?id=${routeListId}&format=docx`} target='_blank'/>
        </Dropdown.Menu>
    </Dropdown>
    )

export default DownloadButton