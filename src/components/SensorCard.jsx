import classes from "../styles/HouseCard.module.css";
import houseClasses from "../styles/HousePage.module.css"
import RoomCard from "./RoomCard";
import {Link} from "react-router-dom";
import Button from "../UI/button/Button";
import Modal from "./Modal";
import {UserContext} from "../contexts/UserContext";
import {useContext, useState} from "react";
import {DOMEN_SERVER} from "../config/const";

const SensorCard = ({children, roomId, houseId, ...props}) => {
    const axios = require('axios');
    const accessToken = useContext(UserContext).accessToken

    const [errorModal, setErrorModal] = useState(() => {
        return {
            errorValue: ""
        }
    })

    const showErrorModal = (text) => {
        setErrorModal(() => {
            return {
                errorValue: text
            }
        })
        document.getElementById("hidden-modal").hidden = false
    }

    const [isModalEdit, setModalEdit] = useState(false)
    const onCloseEdit = () => setModalEdit(false)

    const showPopupEdit = event => {
        event.preventDefault();
        setModalEdit(true)
    }

    const [isModalDelete, setModalDelete] = useState(false)
    const onCloseDelete = () => setModalDelete(false)

    const showPopupDelete = event => {
        event.preventDefault();
        setModalDelete(true)
    }

    const [sensor, setSensor] = useState(() => {
        return {
            id: children.id,
            name: children.name,
        }
    })

    const changeInputSensor = event => {
        event.persist()
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        setSensor(prev => {
            return {
                ...prev,
                [event.target.id]: event.target.value,
            }
        })
    }

    const submitEditSensor = event => {
        event.preventDefault();
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        let regex = /^[a-zA-Zа-яА-Я0-9.!#$%&'*+\s\/=?^_`{|}~-].{0,63}$/;
        if(!regex.test(sensor.name)) {
            showErrorModal("Name is incorrect")
        } else {
            axios.put(DOMEN_SERVER + "/api/web/sensors/" + sensor.id, {
                roomId: roomId,
                name: sensor.name,
                type: 1
            }, {
                headers: {
                    'Authorization': accessToken
                }
            }).then(res => {
                if (res.status === 200) {
                    showErrorModal("Датчик успешно изменен")
                }
                window.location.reload();
            }).catch(error => {
                if (error.response) {
                    showErrorModal(error.response.data.errorText)
                } else {
                    console.log(error.message)
                }
            })
        }
    }

    const submitDeleteSensor = event => {
        event.preventDefault();
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        axios.delete(DOMEN_SERVER + "/api/web/sensors/" + sensor.id, {
            headers: {
                'Authorization': accessToken
            }
        }).then(res => {
            if (res.status === 200) {
                showErrorModal("Датчик успешно удален")
            }
            window.location.reload();
        }).catch(error => {
            if (error.response) {
                showErrorModal(error.response.data.errorText)
            } else {
                console.log(error.message)
            }
        })
    }

    return (
        <div {...props} className={classes.mainDiv}>
            <div className={classes.buttonsDiv}>
                <Button type={"button"} onClick={showPopupEdit}>Изменить</Button>
                <Modal visible={isModalEdit} title='Редактирование датчика'
                       content={<form className={houseClasses.createHouseForm} onSubmit={submitEditSensor}>
                           <input type={"text"} id={"name"} placeholder="Введите название датчика" value={sensor.name}
                                  onChange={changeInputSensor}/>
                           <div hidden className="text-danger" id="hidden-modal">
                               {errorModal.errorValue}
                           </div>
                           <Button type={"submit"}>Отправить</Button>
                       </form>}
                       footer=""
                       onClose={onCloseEdit}
                />
                <Button type={"button"} onClick={showPopupDelete}>Удалить</Button>
                <Modal visible={isModalDelete} title='Удаление датчика'
                       content={<form className={houseClasses.deleteHouseForm} onSubmit={submitDeleteSensor}>
                           <h4>Датчик будет удалён со данными. Вы уверены?</h4>
                           <div hidden className="text-danger" id="hidden-modal">
                               {errorModal.errorValue}
                           </div>
                           <div className={classes.buttonsDiv}>
                               <Button type={"submit"}>Удалить</Button>
                               <Button type={"button"} onClick={onCloseDelete}>Отмена</Button>
                           </div>
                       </form>}
                       footer=""
                       onClose={onCloseDelete}
                />
            </div>
            <div className={classes.nameDiv}>
                <Link to={"/sensors/" + houseId + "/" + roomId + "/" + sensor.id}>{sensor.name}</Link>
            </div>
        </div>
    );
};

export default SensorCard