'use client'
import { useState } from 'react'
import { Container, TextInput, Button, Loader, PasswordInput } from '@mantine/core'
import { apiDomain } from '../config'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import './login.css'

export default function Page () {
  const [sm] = useState(
    (typeof window !== 'undefined') ? window.matchMedia('(min-width: 768px)').matches : null
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const Toast = Swal.mixin({
    customClass: {
      popup: 'swal-popup-class',
      title: 'swal-title-class'
    },
    toast: true,
    position: sm ? 'top' : 'center',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const isEmailValid = () => {
    const regex = /^[A-Za-z]{1,20}23(b|B)[A-Za-z]{2}\d{1,3}$/
    return regex.test(email)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const isPasswordValid = () => {
    return password.length < 20 && password.length >= 3
  }
  const router = useRouter()

  const handleButtonClick = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.append('mailID', email)
    params.append('password', password)

    let urlParams, nextRedirect
    if (typeof window !== 'undefined') {
      urlParams = new URLSearchParams(window.location.search)
      nextRedirect = urlParams.get('next')
      if (!nextRedirect) nextRedirect = 'status'
    }

    fetch(`${apiDomain}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
      .then((response) => {
        if (response.status === 401) {
          Toast.fire({
            icon: 'error',
            title: 'Email or Password incorrect'
          })
        } else {
          response.text().then((data) => {
            localStorage.setItem('emailID', email)
            localStorage.setItem('key', data)
            router.push(`/${nextRedirect}`)
          })
        }
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => setLoading(false))
  }

  return (
        <div className='flex flex-col items-center h-screen'>
            <Container className="items-center rounded-lg"
                style={{ marginTop: '10rem', padding: '1.5rem', color: '#e6e1e6' }}>
                <h3 className="text-1xl text-center sm:text-2xl">
                    Login using your Institute Mail</h3>
                <div className="text-sm mt-5">
                    <TextInput label="Your email" placeholder="name23bte00" rightSection={
                        <span style={{ color: '#e6e1e6' }} className='text-sm'>@iiitkottayam.ac.in</span>}
                        rightSectionWidth={120}
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <PasswordInput className="mt-4" label="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className='text-center items-center'>
                    <Button
                        disabled={!isEmailValid() || loading || !isPasswordValid()}
                        onClick={handleButtonClick}
                        className='mt-3 py-2 px-4 rounded'
                        style={(isEmailValid() && !loading && isPasswordValid())
                          ? {
                              background: '#d4bbff',
                              color: '#3d1b73'
                            }
                          : {
                              background: '#4b4358',
                              color: '#736d7a'
                            } }
                    >
                        {loading ? <Loader size={'xs'} /> : 'Proceed'}

                    </Button>
                </div>

            </Container>
            <div className='fixed mt-2 inset-x-0 bottom-3 text-center text-gray-300'>Built and Maintained by Akshat</div>

        </div>
  )
}
