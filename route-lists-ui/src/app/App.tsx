import { Container, Icon } from 'semantic-ui-react';
import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useStore } from './stores/store';
import { useEffect, useState } from 'react';
import agent from './agent';
import ScrollToTop from 'react-scroll-to-top';
import AutoScrollToTop from './components/AutoScrollToTop';
import Spinner from './components/Spinner';

function App() {

  const { commonStore, userStore } = useStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {


    if (commonStore.token) {
      if (!agent.isTokenExpired()) {
        setLoading(true);
        userStore.getUser()
          .finally(() => setLoading(false));
      }
    }

  }, [])

  if (loading) return <Spinner />

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      <AutoScrollToTop />
      <ScrollToTop smooth style={{ width: '100px' }} component={<Icon name='angle double up' size='big' color='blue' />} />
      <NavBar />
      <Container style={{ marginTop: '5em', paddingLeft: '50px', paddingRight: '50px' }} fluid>
        <Outlet />
      </Container>
    </>
  )
}

export default observer(App)
