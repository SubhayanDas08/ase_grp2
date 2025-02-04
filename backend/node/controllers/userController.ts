import { Request, Response } from 'express'
import { saveRegistrationData, verifyUserCredentials } from '../services/databaseService'

export const FEregistrationData = async (req:Request,res:Response):Promise<void> => {
    const {firstName,lastName,email,password,phoneNumber} = req.body

    try {
        await saveRegistrationData(firstName,lastName,email,password,phoneNumber)
        res.status(400).json('Data saved in Database')
        return
    } 
    catch (error) {
    res.status(500).json({ error: 'Internal server error.' }) 
    }
    

}
export const FElogin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await verifyUserCredentials(email, password);
        if (user) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};