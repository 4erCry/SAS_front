import React, { Component } from 'react'

import { UserContext } from '../contexts/UserContext'

import { Link, Redirect } from 'react-router-dom'
import Button from '../UI/button/Button'

import '../styles/CurrentHousePage.css'

export default class CurrentHousePage extends Component {

  constructor(props){
    super(props)

    this.state = {
      houseId: parseInt(this.props.match.params.houseId, 10),
      house: {},
      roomsData: [],
      downloadPageError: '',
      showCreatePopup: false,
      showEditPopup: false,
      showDeletePopup: false,
      showEditRoomPopup: false,
      showDeleteRoomPopup: false,
      redirect: '',
      newName: '',
      newColor: 'ffffff',
      roomName: '',
      roomColor: 'ffffff',
      roomId: '',
      creatingError: '',
      updatingError: '',
      deletingError: '',
    }

    this.setHouse = this.setHouse.bind(this)
    this.setDownloadPageError = this.setDownloadPageError.bind(this)

    this.setShowCreatePopup = this.setShowCreatePopup.bind(this)
    this.setShowEditPopup = this.setShowEditPopup.bind(this)
    this.setShowDeletePopup = this.setShowDeletePopup.bind(this)
    this.setShowEditRoomPopup = this.setShowEditRoomPopup.bind(this)
    this.setShowDeleteRoomPopup = this.setShowDeleteRoomPopup.bind(this)

    this.setRedirect = this.setRedirect.bind(this)
    this.setNewName = this.setNewName.bind(this)
    this.setNewColor = this.setNewColor.bind(this)
    this.setRoomColor = this.setRoomColor.bind(this)
    this.setRoomId = this.setRoomId.bind(this)

    this.setCreatingError = this.setCreatingError.bind(this)
    this.setUpdatingError = this.setUpdatingError.bind(this)
    this.setDeletingError = this.setDeletingError.bind(this)

    this.getRoomsData = this.getRoomsData.bind(this)
    this.createRoom = this.createRoom.bind(this)
    this.updateHouse = this.updateHouse.bind(this)
    this.deleteHouse = this.deleteHouse.bind(this)
    this.updateRoom = this.updateRoom.bind(this)
    this.deleteRoom = this.deleteRoom.bind(this)
  }

  setHouse(val){
    this.setState({
      house: val
    })
  }

  setRoomsData(val){
    this.setState({
      roomsData: val
    })
  }

  setAddRoomData(val){
    this.setState(prevState => ({
      roomsData: [...prevState.roomsData, val]
    }))
  }

  setDownloadPageError(val){
    this.setState({
      downloadPageError: val
    })

    setTimeout(this.setRedirect, 5000, '/sensors')
  }

  setShowCreatePopup(val){
    this.setState({
      showCreatePopup: val
    })
  }

  setShowEditPopup(val){
    this.setState({
      showEditPopup: val
    })
  }

  setShowDeletePopup(val){
    this.setState({
      showDeletePopup: val
    })
  }

  setShowEditRoomPopup(val){
    this.setState({
      showEditRoomPopup: val
    })
  }

  setShowDeleteRoomPopup(val){
    this.setState({
      showDeleteRoomPopup: val
    })
  }

  setRedirect(val){
    this.setState({
      redirect: val
    })
  }

  setNewName(val){
    this.setState({
      newName: val
    })
  }

  setNewColor(val){
    this.setState({
      newColor: val.substr(1)
    })
  }

  setRoomName(val){
    this.setState({
      roomName: val
    })
  }

  setRoomColor(val){
    this.setState({
      roomColor: val.substr(1)
    })
  }

  setRoomId(val){
    this.setState({
      roomId: val
    })
  }

  setCreatingError(val){
    this.setState({
      ??reatingError: val
    })
  }

  setUpdatingError(val){
    this.setState({
      updatingError: val
    })
  }

  setDeletingError(val){
    this.setState({
      deletingError: val
    })
  }



  getRoomsData(){
    const { house } = this.state
    const { rooms } = house
    const { accessToken } = this.context
    // let accessToken = 'access'

    for(let roomId of rooms){

      fetch('http://3.142.115.21/api/web/rooms/' + roomId, {
        method: 'GET',
        headers: {
          'Authorization': accessToken
        }
      })
      .then(req => req.json())
      .then(data => {
          data = data['result']

          if('errorCode' in data){
            this.setDownloadPageError(data['errorText'])
          } else {
            this.setAddRoomData(data)
          }
        }
      )
      .catch(() => {
        this.setDownloadPageError('???????????????? ?? ????????????????????????')
      })
    }
  }

  componentDidMount(){
    const { houseId } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'


    fetch('http://3.142.115.21/api/web/houses/' + houseId, {
      method: 'GET',
      headers: {
        'Authorization': accessToken
      }
    })
    .then(req => req.json())
    .then(data => {
        data = data['result']

        if('errorCode' in data){
          this.setDownloadPageError(data['errorText'])
        } else {
          this.setHouse(data)
          this.getRoomsData()
        }
      }
    )
    .catch(() => {
      this.setDownloadPageError('???????????????? ?? ????????????????????????')
    })
  }

  createRoom(){
    const { houseId, roomName, roomColor } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'

    fetch('http://3.142.115.21/api/web/rooms/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      body: JSON.stringify({houseId: houseId, name: roomName, color: roomColor})
    })
    .then(req => req.json())
    .then(data => {
        data = data['result']

        if('errorCode' in data){
          this.setCreatingError(data['errorText'])
        } else {
          window.location.reload()
        }
      }
    )
    .catch(() => {
      this.setCreatingError('???????????????? ?? ????????????????????????')
    })
  }

  updateHouse(){
    const { houseId, newName, newColor } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'

    fetch('http://3.142.115.21/api/web/houses/' + houseId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      body: JSON.stringify({id: houseId, name: newName, color: newColor})
    })
    .then(req => req.json())
    .then(data => {
        data = data['result']

        if('errorCode' in data){
          this.setUpdatingError(data['errorText'])
        } else {
          window.location.reload()
        }
      }
    )
    .catch(() => {
      this.setUpdatingError('???????????????? ?? ????????????????????????')
    })
  }

  deleteHouse(){
    const { houseId } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'

    fetch('http://3.142.115.21/api/web/houses/' + houseId, {
      method: 'DELETE',
      headers: {
        'Authorization': accessToken
      },
    })
    .then(req => req.json())
    .then(data => {
        data = data['result']

        if('errorCode' in data){
          this.setDeletingError(data['errorText'])
        } else {
          this.setRedirect('/sensors/')
        }
      }
    )
    .catch(() => {
      this.setDeletingError('???????????????? ?? ????????????????????????')
    })
  }


  updateRoom(){
    const { roomId, roomName, roomColor, houseId } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'

    fetch('http://3.142.115.21/api/web/rooms/' + roomId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      body: JSON.stringify({houseId: houseId, name: roomName, color: roomColor})
    })
    .then(req => req.json())
    .then(data => {
        data = data['result']

        if('errorCode' in data){
          this.setUpdatingError(data['errorText'])
        } else {
          window.location.reload()
        }
      }
    )
    .catch(() => {
      this.setUpdatingError('???????????????? ?? ????????????????????????')
    })
  }

  deleteRoom(){
    const { roomId } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'

    fetch('http://3.142.115.21/api/web/rooms/' + roomId, {
      method: 'DELETE',
      headers: {
        'Authorization': accessToken
      },
    })
    .then(req => {
      if(!req.ok) req.json().then(data => this.setDeletingError(data['result']['errorText']))
      else window.location.reload()
    })
    .catch(() => {
      this.setDeletingError('???????????????? ?? ????????????????????????')
    })
  }

  render(){
    const { house, roomsData, downloadPageError, redirect, showCreatePopup, showEditPopup, showDeletePopup, showEditRoomPopup, showDeleteRoomPopup, creatingError, updatingError, deletingError } = this.state
    const { id, name, color, rooms } = house
    let roomsLen = rooms ? rooms.length : 0

    if(redirect !== '') return <Redirect to={redirect}/>

    if(downloadPageError){
      return (
        <main>
          <div className='only-text'>
            {downloadPageError}
          </div>
        </main>
      )
    }

    let roomCards = [], sensorsCards
    for(const room of roomsData){
      sensorsCards = []
      for(const sensor of room['sensors']){
        sensorsCards.push(
          <div className='sensor-card' key={'sensor-cart' + sensor['id']}>
            <div className='sensor-card-name'>{sensor['name']}</div>
            <div className='sensor-card-type'>??????: {sensor['type']['id']}</div>
            <div className='sensor-card-id'>ID: {sensor['id']}</div>
          </div>
        )
      }

      roomCards.push(
        <div className='room-card' style={{background: '#' + room['color']}} key={'room-cart' + room['id']}>
          <div className='room-buttons'>
            <Button type={'button'} onClick={() => {
                this.setShowEditRoomPopup(true)
                this.setRoomId(room['id'])
              }}>
              ??????????????????????????
            </Button>

            <Button type={'button'} onClick={() => {
                this.setShowDeleteRoomPopup(true)
                this.setRoomId(room['id'])
              }}>
              ??????????????
            </Button>
          </div>

          <div className='room-name-quantity'>
            <Link className='room-name' to={'/sensors/' + id + '/' + room['id']}>{room['name']}</Link>
            <div className='room-quantity'>???????????????????? ????????????????: {room['sensors'].length}</div>
          </div>

          <div className='room-sensors'>
            {sensorsCards}
          </div>
        </div>
      )
    }

    return (
      <main>
        <div className='house-block'>

          <div className='house-info'>
            <div className='house-name-buttons'>
              <div className='house-name'>{name}</div>

              <div className='house-buttons'>
                <Button type={'button'} onClick={() => this.setShowCreatePopup(true)}>??????????????</Button>
                <Button type={'button'} onClick={() => this.setShowEditPopup(true)}>??????????????????????????</Button>
                <Button type={'button'} onClick={() => this.setShowDeletePopup(true)}>??????????????</Button>
              </div>
            </div>
            <div className='house-room-quantity'>???????????????????? ????????????: {roomsLen}</div>
            <div className='house-color'>????????: <span style={{color: '#' + color}}>{color}</span></div>
          </div>


          <div className={'house-rooms'}>
            {roomCards}
          </div>
        </div>

        {showCreatePopup &&
          <div className='room-create-form'>
            <h3>???????????????? ??????????????</h3>

            <input type="text" name="" placeholder="?????????????? ???????????????? ??????????????" onChange={(e) => this.setRoomName(e.currentTarget.value)}/>
            <div className='room-color'>
              <label>???????? ??????????????:</label>
              <input type="color" name="" onChange={(e) => this.setRoomColor(e.currentTarget.value)}/>
            </div>

            {creatingError &&
              <div className='room-create-form-error'>{creatingError}</div>
            }

            <Button type={'button'} onClick={this.createRoom}>??????????????????</Button>
          </div>
        }


        {showEditPopup &&
          <div className='house-edit-form'>
            <h3>???????????????????????????? ????????</h3>

            <input type="text" name="" placeholder="?????????????? ???????????????? ????????" onChange={(e) => this.setNewName(e.currentTarget.value)}/>
            <div className='house-color'>
              <label>???????? ??????????????:</label>
              <input type="color" name="" onChange={(e) => this.setNewColor(e.currentTarget.value)}/>
            </div>

            {updatingError &&
              <div className='house-edit-form-error'>{updatingError}</div>
            }

            <Button type={'button'} onClick={this.updateHouse}>??????????????????</Button>
          </div>
        }

        {showDeletePopup &&
          <div className='house-delete-form'>
            <h3>???????????????? ????????</h3>

            <div>?????? ?????????? ???????????? ???? ?????????? ??????????????????, ?????????????????? ?? ???? ??????????????.<br></br>???? ?????????????? ?</div>

            {deletingError &&
              <div className='house-delete-form-error'>{deletingError}</div>
            }

            <div className='house-delete-form-buttons'>
              <Button type={'button'} onClick={this.deleteHouse}>??????????????</Button>
              <Button type={'button'} onClick={() => this.setShowDeletePopup(false)}>????????????</Button>
            </div>
          </div>
        }

        {showEditRoomPopup &&
          <div className='room-edit-form'>
            <h3>???????????????????????????? ??????????????</h3>

            <input type="text" name="" placeholder="?????????????? ???????????????? ??????????????" onChange={(e) => this.setRoomName(e.currentTarget.value)}/>
            <div className='room-color'>
              <label>???????? ??????????????:</label>
              <input type="color" name="" onChange={(e) => this.setRoomColor(e.currentTarget.value)}/>
            </div>

            {updatingError &&
              <div className='room-edit-form-error'>{updatingError}</div>
            }

            <Button type={'button'} onClick={this.updateRoom}>??????????????????</Button>
          </div>
        }

        {showDeleteRoomPopup &&
          <div className='room-delete-form'>
            <h3>???????????????? ??????????????</h3>

            <div>?????????????? ?????????? ?????????????? ???? ?????????? ?????????????????? ?? ???? ??????????????.<br></br>???? ?????????????? ?</div>

            {deletingError &&
              <div className='room-delete-form-error'>{deletingError}</div>
            }

            <div className='room-delete-form-buttons'>
              <Button type={'button'} onClick={this.deleteRoom}>??????????????</Button>
              <Button type={'button'} onClick={() => this.setShowDeleteRoomPopup(false)}>????????????</Button>
            </div>
          </div>
        }
      </main>
    )
  }
}


CurrentHousePage.contextType = UserContext
