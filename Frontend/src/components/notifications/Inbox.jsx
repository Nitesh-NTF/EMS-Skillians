import React from 'react'
import { BackButton } from '../common/BackButton'
import NotificationBox from './NotificationBox'

export const Inbox = () => {
  // console.log("inbox render")
  return (
    <div>
        {/* <BackButton title='Inbox'/> */}
            <NotificationBox search={true} header={true} pagination={true}/>
    </div>
  )
}
