import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext";
import {DOMEN_SERVER} from "../config/const";
import Button from "../UI/button/Button";
import Modal from "../components/Modal";
import classes from "../styles/CurrentRoomPage.module.css";
import {useParams} from "react-router-dom";
import SensorCard from "../components/SensorCard";

const CurrentRoomPage = () => {
    const axios = require('axios');
    const accessToken = useContext(UserContext).accessToken

    const [error, setError] = useState(() => {
        return {
            errorValue: ""
        }
    })

    const [errorModal, setErrorModal] = useState(() => {
        return {
            errorValue: ""
        }
    })

    const showError = (text) => {
        setError(() => {
            return {
                errorValue: text
            }
        })
        document.getElementById("hidden").hidden = false
    }

    const showErrorModal = (text) => {
        setErrorModal(() => {
            return {
                errorValue: text
            }
        })
        document.getElementById("hidden-modal").hidden = false
    }

    const [isModalCreateSensor, setModalCreateSensor] = useState(false)
    const onCloseCreateSensor = () => setModalCreateSensor(false)

    const showPopupCreateSensor = event => {
        event.preventDefault();
        setModalCreateSensor(true)
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

    const { roomId } = useParams();
    const { houseId } = useParams();
    const [room, setRoom] = useState(()=> {
        return {
            id: roomId,
            houseId: houseId,
            name: "",
            color: "",
            sensors: []
        }
    })

    const [sensors, setSensors] = useState([])

    const [newSensor, setNewSensor] = useState(() => {
        return {
            roomId: 1,
            name: "",
            type: 1
        }
    })

    const changeInputRoom = event => {
        event.persist()
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        setRoom(prev => {
            return {
                ...prev,
                [event.target.id]: event.target.value,
            }
        })
    }

    const changeInputCreateSensor = event => {
        event.persist()
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        setNewSensor(prev => {
            return {
                ...prev,
                [event.target.id]: event.target.value,
            }
        })
    }


    useEffect(() => {
        axios.get(DOMEN_SERVER + "/api/web/rooms/" + roomId, {
            headers: {
                // 'Authorization': accessToken
                'Authorization': accessToken
            }
        })
            .then(function (response) {
                if (response.status === 200) {
                    let data = response.data.result
                    setRoom(() => {
                        return data
                    })
                    setSensors(() => {
                        let sensors = []
                        for (const [key, entry] of data.sensors.entries()) {
                            sensors.push(
                                <SensorCard children={entry} roomId={room.id} houseId={room.houseId} key={key}/>
                            )
                        }
                        return sensors
                    })
                }
            })
            // .then(function ())
            .catch(function (error) {
                if (error.response) {
                    switch (error.response.data.errorCode) {
                        case 7:
                            showError("Invalid access token")
                            break;
                        default:
                            showError("Oops, smth went wrong")
                            break;
                    }
                } else {
                    console.log(error.message)
                }
            })
    }, [accessToken, axios])

    const submitCreateSensor = event => {
        event.preventDefault();
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        let regex = /^[a-zA-Zа-яА-Я0-9.!#$%&'*+\s\/=?^_`{|}~-].{0,63}$/;
        if(!regex.test(newSensor.name)) {
            showErrorModal("Name is incorrect")
        } else {
            axios.post(DOMEN_SERVER + "/api/web/sensors", {
                roomId: room.id,
                name: newSensor.name,
                type: 1
            }, {
                headers: {
                    'Authorization': accessToken
                }
            }).then(res => {
                if (res.status === 200) {
                    showErrorModal("Датчик создан успешно")
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

    const submitEditRoom = event => {
        event.preventDefault();
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        let regex = /^[a-zA-Zа-яА-Я0-9.!#$%&'*+\s\/=?^_`{|}~-].{0,63}$/;
        if(!regex.test(room.name)) {
            showErrorModal("Name is incorrect")
        } else {
            axios.put(DOMEN_SERVER + "/api/web/rooms/" + roomId, {
                houseId: room.houseId,
                name: room.name,
                color: room.color.substring(1),
            }, {
                headers: {
                    'Authorization': accessToken
                }
            }).then(res => {
                if (res.status === 200) {
                    showErrorModal("Информация о комнате успешно изменена")
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

    const submitDeleteRoom = event => {
        event.preventDefault();
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        axios.delete(DOMEN_SERVER + "/api/web/rooms/" + roomId, {
            headers: {
                'Authorization': accessToken
            }
        }).then(res => {
            if (res.status === 200) {
                showErrorModal("Комната успешно удалена")
            }
            window.location.replace(DOMEN_SERVER + "/sensors/" + room.houseId);
        }).catch(error => {
            if (error.response) {
                showErrorModal(error.response.data.errorText)
            } else {
                console.log(error.message)
            }
        })
    }

    return (
        <UserContext.Consumer>{({accessToken}) =>
            (<div className={classes.mainDiv}>
            <div className={classes.roomMenu}>
                <h1 className={classes.roomText}>{room.name}</h1>
                <Button type={"button"} onClick={showPopupCreateSensor}>Создать</Button>
                <Button type={"button"} onClick={showPopupEdit}>Редактировать</Button>
                <Button type={"button"} onClick={showPopupDelete}>Удалить</Button>
            </div>
            <Modal visible={isModalCreateSensor} title='Создание датчика'
                   content={<form className={classes.roomForm} onSubmit={submitCreateSensor}>
                       <input type={"text"} id={"name"} placeholder="Введите название датчика" value={newSensor.name}
                              onChange={changeInputCreateSensor}/>
                       <div hidden className="text-danger" id="hidden-modal">
                           {errorModal.errorValue}
                       </div>
                       <Button type={"submit"}>Отправить</Button>
                   </form>}
                   footer=""
                   onClose={onCloseCreateSensor}
            />
            <Modal visible={isModalEdit} title='Редактирование комнаты'
                   content={<form className={classes.roomForm} onSubmit={submitEditRoom}>
                       <input type={"text"} id={"name"} placeholder="Введите название комнаты" value={room.name}
                              onChange={changeInputRoom}/>
                       <div className={classes.colorDiv}>
                           <input type={"color"} id={"color"} placeholder="Введите цвет" value={room.color}
                                  onChange={changeInputRoom}/>
                           <label htmlFor={"color"}>Цвет комната</label>
                       </div>
                       <div hidden className="text-danger" id="hidden-modal">
                           {errorModal.errorValue}
                       </div>
                       <Button type={"submit"}>Отправить</Button>
                   </form>}
                   footer=""
                   onClose={onCloseEdit}
            />
            <Modal visible={isModalDelete} title='Удаление комнаты'
                   content={<form className={classes.deleteRoomForm} onSubmit={submitDeleteRoom}>
                       <h4>Комната будет удалена со всеми датчиками и их данными. Вы уверены?</h4>
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
            <h4 className={classes.roomSensorsCount}>Количество датчиков {room.sensors.length}</h4>
            <div hidden className="text-danger" id="hidden">
                {error.errorValue}
            </div>
            <div className={classes.sensorsGrid}>
                {sensors}
            </div>
        </div>)}
        </UserContext.Consumer>
    );
};

export default CurrentRoomPage;