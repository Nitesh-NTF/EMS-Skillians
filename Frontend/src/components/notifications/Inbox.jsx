import React from 'react'
import { BackButton } from '../common/BackButton'
import NotificationBox from './NotificationBox'

export const Inbox = () => {
  console.log("inbox render")
  return (
    <div>
        <BackButton title='Inbox'/>
            <NotificationBox  header={true} pagination={true}/>
    </div>
  )
}
