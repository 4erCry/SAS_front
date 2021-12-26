import React, { Component } from 'react'

import '../styles/DocumentationPage.css'

export default class DocumentationPage extends Component {

  render() {

    let jsonText = "{'sensorId': <id>, 'measurementTime': <ваши дата и время>, 'value': <ваше значение>}"

    return (
      <main>
        <div className='doc-blocks'>
          <div>
            <h1>Получение постоянного токена:</h1>
            <ol>
              <li>Авторизируйтесь в свой аккаунт</li>
              <li>Перейдите в настройки аккаунта</li>
              <li>Нажмите кнопку получить <br></br> <b>Внимание!</b> Токен будет показан единожды, его необходимо сохранить. В случае повторной генерации устройства со старым токеном не будут иметь доступ к API.</li>
              <li>Сохраните постоянный токен в надежном месте</li>
            </ol>
            <hr className='separator'></hr>
          </div>

          <div>
            <h1>Создание датчика:</h1>
            <ol>
              <li>Добавьте дом</li>
              <li>Добавьте в только что созданный дом комнату</li>
              <li>Добавьте в только что созданную комнату датчике</li>
            </ol>
            <hr className='separator'></hr>
          </div>

          <div>
            <h1>Отправка данных датчика:</h1>
            <ol>
              <li>Перейдите в только что созданный датчик и сохраните его id</li>
              <li>Создайте http-запрос следующего вида:
                <ol>
                  <li>Метод - POST</li>
                  <li>Адрес - /api/data/</li>
                  <li>Необходимые заголовки:
                    <ol>
                      <li>Content-Type: application/json</li>
                      <li>Authorization: &lt;ваш постоянный токен&gt;</li>
                    </ol>
                  </li>
                  <li>Тело запроса в формате JSON:<br></br>
                    <code>{jsonText}</code>
                  </li>
                </ol>
              </li>
              <li>Отправьте запрос</li>
            </ol>
          </div>
        </div>
      </main>
    )
  }
}
