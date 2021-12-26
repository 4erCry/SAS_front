import React, { Component } from 'react'
import { Line, Chart } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'


import { UserContext } from '../contexts/UserContext'

import { Link, Redirect } from 'react-router-dom'
import Button from '../UI/button/Button'

import '../styles/CurrentSensorPage.css'

Chart.register(ChartDataLabels)

export default class CurrentSensorPage extends Component {

  constructor(props){
    super(props)

    this.state = {
      sensorId: parseInt(this.props.match.params.sensorId, 10),
      roomId: parseInt(this.props.match.params.roomId, 10),
      houseId: parseInt(this.props.match.params.houseId, 10),
      sensor: {},
      sensorData: [],
      house: {},
      room: {},
      downloadPageError: '',
      sensorDataError: '',
      showEditPopup: false,
      showDeletePopup: false,
      startDate: undefined,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
      redirect: '',
      newName: '',
      updatingError: '',
      deletingError: '',
    }

    this.setSensor = this.setSensor.bind(this)
    this.setHouse = this.setHouse.bind(this)
    this.setRoom = this.setRoom.bind(this)
    this.setSensorData = this.setSensorData.bind(this)
    this.setDownloadPageError = this.setDownloadPageError.bind(this)
    this.setSensorDataError = this.setSensorDataError.bind(this)
    this.setShowEditPopup = this.setShowEditPopup.bind(this)
    this.setShowDeletePopup = this.setShowDeletePopup.bind(this)
    this.setStartDate = this.setStartDate.bind(this)
    this.setStartTime = this.setStartTime.bind(this)
    this.setEndDate = this.setEndDate.bind(this)
    this.setEndTime = this.setEndTime.bind(this)
    this.setRedirect = this.setRedirect.bind(this)
    this.setNewName = this.setNewName.bind(this)
    this.setUpdatingError = this.setUpdatingError.bind(this)
    this.setDeletingError = this.setDeletingError.bind(this)

    this.getSensorData = this.getSensorData.bind(this)
    this.updateSensor = this.updateSensor.bind(this)
    this.deleteSensor = this.deleteSensor.bind(this)
  }

  setSensor(val){
    this.setState({
      sensor: val
    })
  }

  setHouse(val){
    this.setState({
      house: val
    })
  }

  setRoom(val){
    this.setState({
      room: val
    })
  }

  setSensorData(val){
    this.setState({
      sensorData: val
    })
  }

  setDownloadPageError(val){
    this.setState({
      downloadPageError: val
    })

    setTimeout(this.setRedirect, 5000, '/sensors')
  }

  setSensorDataError(val){
    this.setState({
      sensorDataError: val
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

  setStartDate(val){
    this.setState({
      startDate: val
    })
  }

  setStartTime(val){
    this.setState({
      startTime: val
    })
  }

  setEndDate(val){
    this.setState({
      endDate: val
    })
  }

  setEndTime(val){
    this.setState({
      endTime: val
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



  getSensorData(){
    const { sensorId, startDate, startTime, endDate, endTime } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'

    let start = new Date(startDate + " " + startTime);
    let end = new Date(endDate + " " + endTime);
    console.log(start)

    start = (start == 'Invalid Date') ? 0 : start.getTime();
    end = (end == 'Invalid Date') ? Number.MAX_SAFE_INTEGER : end.getTime();

    fetch('http://3.142.115.21/api/data/'  + sensorId + '?start=' + start + '&end=' + end, {
      method: 'GET',
      headers: {
        'Authorization': accessToken
      }
    })
    .then(req => req.json())
    .then(data => {
        data = data['result']

        if('errorCode' in data){
          this.setSensorDataError(data['errorText'])
        } else {
          this.setSensorData(data)
        }
      }
    )
    .catch(() => {
      this.setSensorDataError('Проблема с подключением')
    })
  }

  componentDidMount(){
    const { sensorId, houseId, roomId } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'


    fetch('http://3.142.115.21/api/web/sensors/' + sensorId, {
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
          this.setSensor(data)
          this.getSensorData()
        }
      }
    )
    .catch(() => {
      this.setDownloadPageError('Проблема с подключением')
    })


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
        }
      }
    )
    .catch(() => {
      this.setDownloadPageError('Проблема с подключением')
    })

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
          this.setRoom(data)
        }
      }
    )
    .catch(() => {
      this.setDownloadPageError('Проблема с подключением')
    })
  }


  updateSensor(){
    const { sensorId, newName, roomId } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'

    fetch('http://3.142.115.21/api/web/sensors/' + sensorId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      body: JSON.stringify({id: sensorId, roomId: roomId, name: newName, type: 1})
    })
    .then(req => req.json())
    .then(data => {
        data = data['result']

        if('errorCode' in data){
          this.setUpdatingError(data['errorText'])
        } else {
          window.location.reload();
        }
      }
    )
    .catch(() => {
      this.setUpdatingError('Проблема с подключением')
    })
  }

  deleteSensor(){
    const { sensorId, houseId, roomId } = this.state
    const { accessToken } = this.context
    // let accessToken = 'access'

    fetch('http://3.142.115.21/api/web/sensors/' + sensorId, {
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
          this.setRedirect('/sensors/' + houseId + '/' + roomId)
        }
      }
    )
    .catch(() => {
      this.setDeletingError('Проблема с подключением')
    })
  }


  render(){
    const { sensor, house, room, sensorData, downloadPageError, redirect, showEditPopup, showDeletePopup, updatingError, deletingError } = this.state
    const { id, roomId, name, type } = sensor

    const houseUrl = `/sensors/${house["id"]}`
    console.log(room)
    const roomUrl = `/sensors/${house["id"]}/${room["id"]}`

    let options
    let data = {
      labels: sensorData.map((el) => {return el['date']}),
      datasets: [
        {
          label: 'График',
          data: sensorData.map((el) => {return el['value']}),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
      ]
    }

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

    return (
      <main>
        <div className='sensor-block'>
          <div className='sensor-url'>
            <Link to={houseUrl}>{house['name']}</Link>/<Link to={roomUrl}>{room['name']}</Link>
          </div>

          <div className='sensor-info'>
            <div className='sensor-name-buttons'>
              <div className='sensor-name'>{name}</div>

              <div className='sensor-buttons'>
                <Button type={'button'} onClick={() => this.setShowEditPopup(true)}>Редактировать</Button>
                <Button type={'button'} onClick={() => this.setShowDeletePopup(true)}>Удалить</Button>
              </div>
            </div>
            <div className='sensor-id'>ID: {id}</div>
            <div className='sensor-type'>ТИП: {type}</div>
          </div>

          <div className='sensor-chart'>

            <div>
              <Line width={'700px'} height={'350px'} data={data} options={options}/>
            </div>

            <div className='sensor-chart-inputs'>

              <input type="date" placeholder="Введите начальную дату" onChange={(e) => this.setStartDate(e.currentTarget.value)}/>
              <input type="time" placeholder="Введите начальное время" onChange={(e) => this.setStartTime(e.currentTarget.value)}/>

              <input type="date" placeholder="Введите конечную дату" onChange={(e) => this.setEndDate(e.currentTarget.value)}/>
              <input type="time" placeholder="Введите конечное время" onChange={(e) => this.setEndTime(e.currentTarget.value)}/>

              <Button type={'button'} onClick={this.getSensorData}>Применить</Button>
            </div>
          </div>
        </div>

        {showEditPopup &&
          <div className='sensor-edit-form'>
            <h3>Редактирование датчика</h3>

            <input type="" name="" placeholder="Введите название датчика" onChange={(e) => this.setNewName(e.currentTarget.value)}/>

            {updatingError &&
              <div className='sensor-edit-form-error'>{updatingError}</div>
            }

            <Button type={'button'} onClick={this.updateSensor}>Отправить</Button>
          </div>
        }

        {showDeletePopup &&
          <div className='sensor-delete-form'>
            <h3>Удаление датчика</h3>

            <div>Датчик будет удалён со всеми данными.<br></br>Вы уверены ?</div>

            {deletingError &&
              <div className='sensor-delete-form-error'>{deletingError}</div>
            }

            <div className='sensor-delete-form-buttons'>
              <Button type={'button'} onClick={this.deleteSensor}>Удалить</Button>
              <Button type={'button'} onClick={() => this.setShowDeletePopup(false)}>Отмена</Button>
            </div>
          </div>
        }
      </main>
    )
  }
}


CurrentSensorPage.contextType = UserContext
