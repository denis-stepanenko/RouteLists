import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Button, Grid, Header, Image, Item, Modal, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { useEffect, useState } from "react";
import axios from "axios";
import 'react-advanced-cropper/dist/style.css'
import { PhotoCropper } from "./PhotoCropper";
import Spinner from "../../app/components/Spinner";

export default observer(function Profile() {
    const { username } = useParams<{ username: string }>();
    const { userStore } = useStore();
    const { loading, photoDeleting, isCurrentUser, profile, getProfile, changePhoto, deletePhoto } = userStore;
    const [open, setOpen] = useState(false);


    useEffect(() => {
        getProfile(username!);
    }, [username, getProfile])

    if (loading) return <Spinner />

    return (
        <div>
            <Modal
                closeIcon
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                size='small'
            >
                <Header>
                    Загрузка фото
                </Header>

                <Modal.Content>
                    <PhotoCropper onUpload={((blob) => {
                        changePhoto(blob);
                        setOpen(false);
                    })} />
                </Modal.Content>

            </Modal>

            <h1>Профиль</h1>
            <Segment>
                <Grid>
                    <Grid.Column width={12}>
                        <Item.Group>
                            <Item>
                                <Image avatar size="small" src={profile?.photoUrl ? axios.defaults.baseURL + profile?.photoUrl : '/user.png'} />
                                <Item.Content verticalAlign="middle">
                                    <Header as='h1' content={profile?.name} />
                                    <Item.Meta content={profile?.username} />
                                    <Item.Description content={`Подразделение: ${profile?.department}`} />
                                </Item.Content>
                            </Item>
                            {isCurrentUser && (
                                <>
                                    <Item>
                                        <Button onClick={() => setOpen(true)} content='Изменить фото' />

                                        {profile?.photoUrl && (
                                            <Button loading={photoDeleting} onClick={deletePhoto} content='Удалить фото' />
                                        )}
                                    </Item>
                                </>
                            )}
                        </Item.Group>
                    </Grid.Column>
                </Grid>
            </Segment>
        </div>
    )
})
