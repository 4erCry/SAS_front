import classes from "../styles/HouseCard.module.css";
import houseClasses from "../styles/HousePage.module.css"
import RoomCard from "./RoomCard";
import {Link} from "react-router-dom";
import Button from "../UI/button/Button";
import Modal from "./Modal";
import {UserContext} from "../contexts/UserContext";
import {useContext, useState} from "react";
import {DOMEN_SERVER} from "../config/const";

const HouseCard = ({children, ...props}) => {
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

    const [house, setHouse] = useState(() => {
        return {
            id: children.id,
            name: children.name,
            color: "#" + children.color,
            rooms: children.rooms
        }
    })

    const changeInputHouse = event => {
        event.persist()
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        setHouse(prev => {
            return {
                ...prev,
                [event.target.id]: event.target.value,
            }
        })
    }

    const submitEditHouse = event => {
        event.preventDefault();
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        let regex = /^[a-zA-Zа-яА-Я0-9.!#$%&'*+\s\/=?^_`{|}~-].{0,63}$/;
        if(!regex.test(house.name)) {
            showErrorModal("Name is incorrect")
        } else {
            axios.put(DOMEN_SERVER + "/api/web/houses/" + house.id, {
                name: house.name,
                color: house.color.substring(1),
            }, {
                headers: {
                    'Authorization': accessToken
                }
            }).then(res => {
                if (res.status === 200) {
                    showErrorModal("Дом создан успешно")
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

    const submitDeleteHouse = event => {
        event.preventDefault();
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        axios.delete(DOMEN_SERVER + "/api/web/houses/" + house.id, {
            headers: {
                'Authorization': accessToken
            }
        }).then(res => {
            if (res.status === 200) {
                showErrorModal("Дом успешно удален")
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
        <div {...props} className={classes.mainDiv} style={{backgroundColor: house.color}}>
            <div className={classes.buttonsDiv}>
                <Button type={"button"} onClick={showPopupEdit}>Изменить</Button>
                <Modal visible={isModalEdit} title='Редактирование дома'
                       content={<form className={houseClasses.createHouseForm} onSubmit={submitEditHouse}>
                           <input type={"text"} id={"name"} placeholder="Введите название дома" value={house.name}
                                  onChange={changeInputHouse}/>
                           <div className={houseClasses.colorDiv}>
                               <input type={"color"} id={"color"} placeholder="Введите цвет" value={house.color}
                                      onChange={changeInputHouse}/>
                               <label htmlFor={"color"}>Цвет дома</label>
                           </div>
                           <div hidden className="text-danger" id="hidden-modal">
                               {errorModal.errorValue}
                           </div>
                           <Button type={"submit"}>Отправить</Button>
                       </form>}
                       footer=""
                       onClose={onCloseEdit}
                />
                <Button type={"button"} onClick={showPopupDelete}>Удалить</Button>
                <Modal visible={isModalDelete} title='Удаление дома'
                       content={<form className={houseClasses.deleteHouseForm} onSubmit={submitDeleteHouse}>
                           <h4>Дом будет удалён со всеми комнатами, датчиками и их данными. Вы уверены?</h4>
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
                <Link to={"/sensors/" + house.id}>{house.name}</Link>
                <h4>{house.rooms.length}</h4>
            </div>
            <div className={classes.roomDiv}>
                {house.rooms.map((id) => {
                    return <RoomCard key={id} houseId={house.id} roomId={id}/>
                })}
            </div>
        </div>
    );
};

export default HouseCard