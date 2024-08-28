'use client'

import { Button, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useDisclosure, useToast } from "@chakra-ui/react"
import Link from "next/link"
import { useState, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa";
import NoteList from './NoteList';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const createToast = useToast()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const clearFields = () => {
    setTitle('')
    setBody('')
  }

  const fetchNotes = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_NOTES_BE_URL}/api/v1/note`)
      .then((data) => data.json())
      .then((notes) => setNotes(notes))
      .catch((e) => console.error("Failed to fetch notes", e))
      .finally(() => setLoading(false))
  };

  const createNewNote = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NOTES_BE_URL}/api/v1/note`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        body: body
      })
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
      clearFields()
      onClose()
    } else {
      createToast({
        title: "Success!",
        description: "The note has been created successfully.",
        status: "success",
        position: "bottom-right",
        isClosable: true
      })
      clearFields()
      onClose()
      fetchNotes();
    }
  }

  useEffect(() => {
    fetchNotes();
  }, [notes]);

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
          <Link href={'/'}>
            <Heading size={'lg'} ml={5} fontWeight={'bold'} color={'black'}>Notes App</Heading>
          </Link>
        </Flex>
        <Spacer />
        <Flex alignItems={'center'} mr={5} gap={3}>
          <Button 
            leftIcon={<FaFileUpload/>}
            onClick={onOpen}
          >
            Create Note
          </Button>
        </Flex>
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input 
                placeholder='My Description' 
                isRequired
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createNewNote}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <NoteList notes={notes} loading={loading} />
    </>
  )
}

export default Navbar
