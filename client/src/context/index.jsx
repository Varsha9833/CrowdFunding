import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import {ethers} from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

import { contractAddress, contractABI } from '../constants';
import { pid } from 'process';

const StateContext= createContext();

export const StateContextProvider = ({ children}) => {
    const { contract } = useContract(contractAddress, contractABI); 
    const {mutateAsync: createCampaign} = useContractWrite(contract, 'createCampaign'); 

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async(form) => {
        try {
            if (!form.target) {
                throw new Error("Target value is missing");
            }

            const parsedTarget = ethers.utils.parseUnits(form.target, 18).toString();

        
            const data = await contract.call("createCampaign",[
            address,
            form.title,
            form.description,
            parsedTarget,
            new Date(form.deadline).getTime(),
            form.image

        ]);

        console.log("contract call success", data);
            
        } catch (error) {
            console.log("contract call failure", error);
        }
        
    }
    const getCampaigns = async () =>{
        const campaigns= await contract.call('getCampaigns');

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i
        }));

        return parsedCampaigns;
    }

    const getUserCampaigns = async () => {
        const allcampaigns = await getCampaigns();

        const filteredCampaigns = allcampaigns.filter((campaign) => campaign.owner === address);

        return filteredCampaigns;
    }

    const donate = async (pId, amount) => {
        if (!pId) {
            throw new Error("pId is undefined");
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            throw new Error("Invalid donation amount");
        }


        const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

        return data;
    }

    const getDonations = async (pId) =>{
        const donations = await contract.call('getDonators', [pId]);    //
        const numberOfDonations = donations[0].length;

        const parsedDonations =[];

        for( let i=0; i< numberOfDonations; i++){
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations;
    }


    return(
       < StateContext.Provider
        value={{
            address,
            contract,
            connect,
            createCampaign: publishCampaign,
            getCampaigns,
            getUserCampaigns,
            donate,
            getDonations
        }}
       >
            {children}
       </StateContext.Provider>
    );
};


export const useStateContext = () => useContext(StateContext);