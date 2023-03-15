import axios from 'axios'

const serviceProxy = axios.create({
    baseURL: 'http://222.255.238.183:8002', // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 50000 // request timeout
})

export function requestAccess(body) {
    return serviceProxy({
      url: '/api/access-requests',
      method: 'post',
      data: body
    })
}

export function confirmOtp(body) {
    return serviceProxy({
        url: '/api/otp/confirm',
        method: 'post',
        data: body
    })
}