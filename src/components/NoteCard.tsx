'use client'

import { DeleteIcon } from "@chakra-ui/icons"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import React from "react"

interface NoteProps {
  id: string
  title: string
  body: string
  createdAt: Date
}

const NoteCard =  ({ id, title, body, createdAt }: NoteProps) => {
  const router = useRouter()
  const createToast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const date = new Date(createdAt).toUTCString()
  const deleteNote = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NOTES_BE_URL}/api/v1/note/${id}`, {
      method: 'delete'
    })
    if (!res.ok) {
      const body = await res.json()
      createToast({
        title: "Error",
        description: body.message,
        status: "error",
        position: "bottom-right",
        isClosable: true
      })
    } else {
      createToast({
        title: "Note Deleted",
        description: "The note has been deleted successfully.",
        status: "success",
        position: "bottom-right",
        isClosable: true
      })
      onClose()
      router.push("/")
    }
  }

  return (
    <>

        <Card variant={'elevated'}
          sx={{
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            _hover: {
              transform: 'scale(1.01)',
              boxShadow: 'lg',
            },
          }}
        >
          <CardHeader bgColor={'pink.200'} 
            onClick={() => {
              router.push(`/note/${id}`)
            }}
          >
            <Heading size={'md'} fontFamily={'cursive'}>{title}</Heading>
          </CardHeader>
          <CardBody
            onClick={() => {
              router.push(`/note/${id}`)
            }}  
          >
            <Text fontSize={'sm'}>{body}</Text>
          </CardBody>
          <Divider color={'gray.200'}/>
          <CardFooter justify={'space-between'}>
            <Text fontSize={'xs'}>{date}</Text>
            <Spacer />
            <IconButton
              aria-label="Delete note"
              icon={< DeleteIcon/>}
              onClick={onOpen}
            ></IconButton>
          </CardFooter>
        </Card>
        <Modal isCentered isOpen={isOpen} onClose={onClose} size={'sm'}>
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
        <ModalContent>
          <ModalHeader>Are you sure want to delete this note?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={deleteNote}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NoteCard