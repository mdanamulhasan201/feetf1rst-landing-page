import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function RegisterEmailModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success('E-Mail wurde erfolgreich gesendet')
            setEmail('')
            onClose()
        }, 1000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEmail(''); onClose() } }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-center">
                    {/* Logo */}
                    <div className="flex justify-center mb-4 w-full">
                        <Image src='/logo/logoBlue.png' alt="logo" width={100} height={100} className='w-14' />
                    </div>

                    <DialogTitle className="text-2xl font-bold text-black">
                        Anmeldung per E-Mail
                    </DialogTitle>

                    <p className="text-sm text-gray-600 mt-2">
                        Bitte geben Sie die E-Mail-Adresse ein, die Sie bereits bei FeetF1rst verwendet haben – Sie erhalten dann einen Bestätigungslink per E-Mail.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            E-Mail
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full mt-2"
                        />
                    </div>

                    <div className='flex justify-center'>
                        <Button
                            type="submit"
                            className="w-fit bg-transparent text-black border border-black hover:bg-black hover:text-white cursor-pointer transition-all duration-300"
                            disabled={isLoading || !email}
                            variant="default"
                            size="default"
                        >
                            {isLoading ? 'Wird gesendet...' : 'Link anfordern'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
