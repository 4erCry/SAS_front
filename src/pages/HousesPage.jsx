import Button from "../UI/button/Button";
import React, {useEffect, useState, useContext} from "react";
import {UserContext} from "../contexts/UserContext";
import HouseCard from "../components/HouseCard";
import classes from "../styles/HousePage.module.css";
import {DOMEN_SERVER} from '../config/const';
import Modal from "../components/Modal";

const HousesPage = () => {
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

    const [isModal, setModal] = useState(false)
    const onClose = () => setModal(false)

    const showPopup = event => {
        event.preventDefault();
        setModal(true)
    }

    const [houses, setHouses] = useState([])

    const [newHouse, setNewHouse] = useState(() => {
        return {
            name: "",
            color: ""
        }
    })

    const changeInputHouse = event => {
        event.persist()
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        setNewHouse(prev => {
            return {
                ...prev,
                [event.target.id]: event.target.value,
            }
        })
    }

    const submitCreateHouse = event => {
        event.preventDefault();
        let hidden = document.getElementById("hidden-modal");
        hidden.hidden = true
        let regex = /^[a-zA-Zа-яА-Я0-9.!#$%&'*+\s\/=?^_`{|}~-].{0,63}$/;
        if(!regex.test(newHouse.name)) {
            showErrorModal("Name is incorrect")
        } else {
            axios.post(DOMEN_SERVER + "/api/web/houses", {
                name: newHouse.name,
                color: newHouse.color.substring(1),
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

    useEffect(() => {
        let data = []
        axios.get(DOMEN_SERVER + "/api/web/houses", {
            headers: {
                // 'Authorization': accessToken
                'Authorization': accessToken
            }
        })
            .then(function (response) {
                if (response.status === 200) {
                    data = response.data.result
                    setHouses(() => {
                        let houses = []
                        for (const [key, entry] of data.entries()) {
                            houses.push(
                                <HouseCard children={entry} key={key}/>
                            )
                        }
                        return houses
                    })
                }
            })
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

    return (
        <UserContext.Consumer>{({accessToken}) =>
            (<div className={classes.mainDiv}>
            <div className={classes.createHouseDiv}>
                <h1 className={classes.allHousesText}>Все дома</h1>
                <Button type={"button"} onClick={showPopup}>Создать</Button>
            </div>
            <Modal visible={isModal} title='Создание дома'
                   content={<form className={classes.createHouseForm} onSubmit={submitCreateHouse}>
                       <input type={"text"} id={"name"} placeholder="Введите название дома" value={newHouse.name}
                              onChange={changeInputHouse}/>
                       <div className={classes.colorDiv}>
                           <input type={"color"} id={"color"} placeholder="Введите цвет" value={newHouse.color}
                                  onChange={changeInputHouse}/>
                           <label htmlFor={"color"}>Цвет дома</label>
                       </div>
                       <div hidden className="text-danger" id="hidden-modal">
                           {errorModal.errorValue}
                       </div>
                       <Button type={"submit"}>Отправить</Button>
                   </form>}
                   footer=""
                   onClose={onClose}
            />
            <h4 className={classes.housesCount}>Домов {houses.length}</h4>
            <div hidden className="text-danger" id="hidden">
                {error.errorValue}
            </div>
            <div className={classes.housesGrid}>
                {houses}
            </div>
        </div>)}
        </UserContext.Consumer>
    );
};

export default HousesPage;