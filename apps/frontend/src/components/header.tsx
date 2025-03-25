import vechainLogo from "../assets/vechain.png";
import {Heading, Text, Box} from "@chakra-ui/react";
import './header.css';
import React from "react";
import { LoginButton } from "./loginbutton";
import { VetBalance } from "./vetbalance";

export function AppHeader() {
    return (
        <Box width={'100%'}>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                <a href="https://vechain.org" target="_blank">
                    <img src={vechainLogo} className="logo" alt="VeChain logo" />
                </a>
                <VetBalance/>
                <LoginButton/>
            </Box>
        </Box>
    )
}