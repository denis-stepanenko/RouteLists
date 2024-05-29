import { Container, Menu, Image, Dropdown } from 'semantic-ui-react'
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import axios from 'axios';

export default observer(function NavBar() {
    const { userStore } = useStore();
    const { isLoggedIn, user, logout } = userStore;

    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header name="Маршрутные листы" as={NavLink} to='/routelists' />
                <Menu.Item header name="Операции" as={NavLink} to='/operations' />
                <Menu.Item header name="Исполнители" as={NavLink} to='/executors' />
                <Menu.Item header name="Шаблоны" as={NavLink} to='/techProcesses' />

                {user?.roles.includes('admin') && (
                    <>
                        <Menu.Item header name="Пользователи" as={NavLink} to='/users' />
                        <Menu.Item header name="Роли" as={NavLink} to='/roles' />
                    </>
                )}

                {isLoggedIn ?
                    (
                        <Menu.Item position='right'>
                            <Link to={`/profiles/${user?.username}`}>
                                <Image src={user?.photoUrl ? axios.defaults.baseURL + user?.photoUrl : '/user.png'}
                                    avatar spaced='right' style={{ height: '40px', width: '40px' }} />
                            </Link>

                            <Dropdown text={user?.name} item style={{paddingLeft: 5, backgroundColor: '#1b1c1d'}}>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to={`/profiles/${user?.username}`} text='Профиль' icon='user' />
                                    <Dropdown.Item onClick={logout} text='Выйти' icon='power' />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    )
                    :
                    (
                        <Menu.Item header name="Войти" as={NavLink} to='/login' />
                    )
                }
            </Container>
        </Menu>
    )
})