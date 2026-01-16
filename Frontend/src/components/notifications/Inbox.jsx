import React from 'react'
import { BackButton } from '../common/BackButton'
import NotificationBox from './NotificationBox'

export const Inbox = () => {
  return (
    <div>
        <BackButton title='Inbox'/>
            <NotificationBox  header={true} pagination={true}/>
    </div>
  )
}
