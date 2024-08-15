import { Box, Card, CardBody, Flex, SimpleGrid, Text } from "@chakra-ui/react"
import NoteCard from "./NoteCard"
import { Note } from "@/types"

export const NoteList = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_NOTES_BE_URL}/api/v1/note`).then((res) => res.json())
  if (data.length === 0) {
    return (
      <Flex justifyContent={'center'} mt={10}>
        <Card w={'300px'} h={'200px'}>
          <CardBody>
            <Text fontSize={'large'} align={'center'}>Tidak ada catatan</Text>
          </CardBody>
        </Card>
      </Flex>
    )
  }
  return (
    <Box maxW={'container.lg'} m={'auto'} p={4}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3}} spacing={6}>
        {data?.map((note: Note) => (
          <NoteCard 
            key={note.id}
            id={note.id}
            title={note.title}
            body={note.body}
            createdAt={note.createdAt}
          />
        ))}
      </SimpleGrid>
    </Box>
  )
}