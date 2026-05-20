import React, { useContext, useEffect, useState } from 'react'
import { toastContext } from '../context/ToastContext'

const useToastHandler = () => {
 
return useContext(toastContext)
}

export default useToastHandler