'use client'

import { DeleteIcon, EditIcon, ArrowLeftIcon } from "@chakra-ui/icons"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, FormControl, FormLabel, Heading, IconButton, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { usePathname, useRouter } from "next/navigation"
import { Note } from "@/types"
import { useEffect, useState } from "react"
import { FaFileUpload } from "react-icons/fa"

const NoteDetails = () => {
  const pathName = usePathname()
  const router = useRouter()
  const createToast = useToast()
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  const [note, setNote] = useState<Note | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [updateTitle, setUpdateTitle] = useState(note?.title)
  const [updateBody, setUpdateBody] = useState(note?.body)
  const id = pathName.split('/')[2]

  const fetchNote = async () => {
    const noteId = pathName.split('/')[2]
    const res = await fetch(`${process.env.NEXT_PUBLIC_NOTES_BE_URL}/api/v1/note/${noteId}`)
    const data = await res.json()
    setNote(data)
    setUpdateTitle(data.title)
    setUpdateBody(data.body)
  }
  useEffect(() => {
    fetchNote()
  }, [])

  const clearFields = () => {
    setNewTitle('')
    setNewBody('')
  }

  const createNewNote = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NOTES_BE_URL}/api/v1/note`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newTitle,
        body: newBody
      })
    })

    if (!res.ok) {
      const body = await res.json()
      createToast({
        title: "Error",
        description: body.error,
        status: "error",
        position: "bottom-right",
        isClosable: true
      })
      clearFields()
      onCreateClose()
    } else {
      createToast({
        title: "Success!",
        description: "The note has been created successfully.",
        status: "success",
        position: "bottom-right",
        isClosable: true
      })
      clearFields()
      onCreateClose()
      router.push("/")
    }
  }

  const updateNote = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NOTES_BE_URL}/api/v1/note/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: updateTitle,
        body: updateBody
      })
    })

    if (!res.ok) {
      const body = await res.json()
      
      createToast({
        title: "Error",
        description: body.error,
        status: "error",
        position: "bottom-right",
        isClosable: true
      })
      onUpdateClose()
    } else {
      createToast({
        title: "Success!",
        description: "The note has been updated successfully.",
        status: "success",
        position: "bottom-right",
        isClosable: true
      })
      onUpdateClose()
      fetchNote()
    }
  }

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
      onDeleteClose()
      router.push("/")
    }
  }


  if (!note) {
    return <Text>Loading...</Text>
  }
  const date = new Date(note.createdAt).toUTCString()
  return (
    <>
    <Flex
      w='100vw'
      h='56px'
      borderBottom='1px'
      borderColor={'yellow.300'}
      bgColor={'yellow.300'}
      p={2}
      px={2}
      justify={'space-between'}
    >
      <Flex
        display={'flex'}
        alignItems={'center'}
      >
          <IconButton 
            aria-label="Back"
            icon={ <ArrowLeftIcon /> }
            onClick={() => router.push("/")}
          />
      </Flex>
      <Spacer />
      <Flex alignItems={'center'} mr={5} gap={3}>
        <Button 
          leftIcon={<FaFileUpload/>}
          onClick={onCreateOpen}
        >
          Create Note
        </Button>
      </Flex>
    </Flex>
    <Flex 
      justifyContent={'center'}
    >
    <Card variant={'elevated'}
      mt={10}
      width={'500px'}
      height={'400px'}
    >
        <CardHeader bgColor={'pink.200'} justifyContent={'space-between'} boxSize={'auto'}>
          <Flex 
            justifyContent={'space-between'}
          >
            <Heading size={'md'} fontFamily={'cursive'}>{note.title}</Heading>
            <Spacer />
            <IconButton 
              aria-label="Edit note"
              icon={ <EditIcon/> }
              onClick={onUpdateOpen}
            />
          </Flex>
        </CardHeader>
        <CardBody>
          <Text fontSize={'sm'}>{note.body}</Text>
        </CardBody>
        <Divider color={'gray.200'} />
        <CardFooter justify={'space-between'}>
          <Text fontSize={'xs'}>{date}</Text>
          <Spacer />
          <IconButton
            aria-label="Delete note"
            icon={<DeleteIcon />}
            onClick={onDeleteOpen}
          ></IconButton>
        </CardFooter>
      </Card>
    </Flex>
    <Modal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new note</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input 
                placeholder='My Note' 
                isRequired
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input 
                placeholder='My Description' 
                isRequired
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createNewNote}>
              Save
            </Button>
            <Button onClick={onCreateClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    <Modal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update note</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input  
                isRequired
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input 
                isRequired
                value={updateBody}
                onChange={(e) => setUpdateBody(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={updateNote}>
              Save
            </Button>
            <Button onClick={onUpdateClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isCentered isOpen={isDeleteOpen} onClose={onDeleteClose} size={'sm'}>
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
            <Button onClick={onDeleteClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NoteDetails