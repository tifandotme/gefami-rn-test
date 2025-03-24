import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState([
    { id: 1, name: "John Doe", occupation: "Software Developer", age: 28 },
    { id: 2, name: "Jane Smith", occupation: "UI/UX Designer", age: 32 },
    { id: 3, name: "Bob Johnson", occupation: "Project Manager", age: 45 },
    { id: 4, name: "Alice Brown", occupation: "Data Scientist", age: 30 },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const changeDisplayedPerson = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  return (
    <Center className="flex-1">
      <Heading className="font-bold text-2xl">Person Information</Heading>
      <Divider className="my-[30px] w-[80%]" />

      <Text className="text-lg mb-2">Name: {data[currentIndex].name}</Text>
      <Text className="text-lg mb-2">
        Occupation: {data[currentIndex].occupation}
      </Text>
      <Text className="text-lg mb-8">Age: {data[currentIndex].age}</Text>
      <Button onPress={changeDisplayedPerson} variant="solid" action="primary">
        <ButtonText>Show Next Person</ButtonText>
      </Button>
    </Center>
  );
}
