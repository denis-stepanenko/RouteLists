import { observer } from 'mobx-react-lite';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

interface Props {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    onDelete: () => void
}

export default observer(function ConfirmDelete({ isOpen, onOpen, onClose, onDelete }: Props) {
    return (
        <Modal
            basic
            onClose={onClose}
            onOpen={onOpen}
            open={isOpen}
            size='small'
        >
            <Header icon>
                <Icon name='trash' />
                Удалить запись?
            </Header>
            <Modal.Actions>
                <Button color='red' inverted onClick={() => {
                    onDelete();
                    onClose();
                }}>
                    <Icon name='checkmark' /> Да
                </Button>

                <Button basic color='green' inverted onClick={onClose}>
                    <Icon name='remove' /> Нет
                </Button>
            </Modal.Actions>
        </Modal>
    )
})
