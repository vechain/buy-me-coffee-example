import React from "react";
import { Heading, Text, Box } from "@chakra-ui/react";
import { motion } from "framer-motion"; // For animations

// Animation variants for the heading
const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Animation variants for the text
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3, ease: "easeOut" },
  },
};

// Animation for the emoji
const emojiVariants = {
  hover: {
    scale: 1.2,
    rotate: [0, 10, -10, 0],
    transition: { duration: 0.3, repeat: Infinity, repeatType: "loop" },
  },
};

export const WelcomeText = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      py={6}
      gap={3} 
    >
      {/* Animated Heading */}
      <Heading
        as={motion.h1}
        variants={headingVariants}
        initial="hidden"
        animate="visible"
        size={{ base: "lg", md: "xl" }}
        bgGradient="linear(to-r, blue.400, teal.400)"
        bgClip="text"
        fontWeight="bold"
      >
        Buy Me a Coffee
      </Heading>

      {/* Animated Text with Interactive Emoji */}
      <Text
        as={motion.p}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        fontSize={{ base: "md", md: "lg" }}
        color="gray.600"
        display="flex"
        alignItems="center"
        gap={2}
      >
        Send me a coffee for 1 VET, share the love!{" "}
        <Box
          as={motion.span}
          //@ts-ignore
          variants={emojiVariants}
          whileHover="hover"
          display="inline-block"
        >
          ☕❤️
        </Box>
      </Text>
    </Box>
  );
};