const errorMsg = require('../errors')
const router = (require('express')).Router()
const auth = (require('../middlewares/JWT_verifyToken'))
const {user} = (require('../db')).models

router.post('/',auth, async(req,res)=>{

    //This is the user who pressed the subscription button
    const username = req.username

    //This is the Id from the channel who the user wants to subscribe
    const subscriptionId = req.query?.id

    //If no id is sent to the server the error message is send
    if(!subscriptionId) return res.status(400).json({message: errorMsg[400]})

    try {
        //Search for the user in the database
        const userFound = await user.findOne({ where: {username}})

        //If no user is founded, send an error message
        if(!userFound) return res.status(404).json({message: errorMsg['404_user']})

        //Search for the subscription channel in the database
        const subscriptionFound = await user.findByPk(subscriptionId)

        //If the channel is not founded, an error message is send
        if(!subscriptionFound) return res.status(404).json({message: errorMsg['404_user']})

        //If the user id and channel id are the same an error response is send
        if(userFound.id === subscriptionId) return res.status(403).json({message: "User and subscription cannot be the same"})

        //Ask if the user already is subscribed to the channel, checking the subscription list on the userFound side
        const isSubscriptionExist = userFound.subscriptions?.includes(subscriptionId)

        //If the susbcription already exist, both id's will be deleted fron their respective lists: followers on the subscriptionFound and subscriptions on the userFound
        if(isSubscriptionExist){
            //delete subscription id from the list
            const indexOfSubscription = userFound.subscriptions.indexOf(subscriptionId)
            userFound.subscriptions.splice(indexOfSubscription,1)
            userFound.changed("subscriptions",true)
            //Save changes in the record
            await userFound.save()
            //delete follower id from the list
            const indexOfFollower = subscriptionFound.followers.indexOf(userFound.id)
            subscriptionFound.followers.splice(indexOfFollower,1)
            subscriptionFound.changed("followers",true)
             //Update the followers counter
            subscriptionFound.followersCount = subscriptionFound.followers.length
            //save the changes
            await subscriptionFound.save()
            //send the response
            return res.status(200).json({message: "Subscription removed"})
        }
        //If it is the 1st time the user subscribe to a channel the subscriptions list must be set first on [] to do the next actions
        if(!userFound.subscriptions) userFound.subscriptions = []

        //Add the id to the subscriptions list
        userFound.subscriptions.push(subscriptionId)
        userFound.changed("subscriptions",true)
        //Save the changes
        await userFound.save()
        //If it is the first time a channel get a follower, the list on the subscriptionFound must be set as [] 
        if(!subscriptionFound.followers) subscriptionFound.followers = []

        //Add the id of the follower to the list
        subscriptionFound.followers.push(userFound.id)

        subscriptionFound.changed("followers",true)
         //Update the followers counter
        subscriptionFound.followersCount = subscriptionFound.followers.length
        //save the changes
        await subscriptionFound.save()
        //If all went rigth send the message
        return res.status(200).json({message: "subscription added"})
    } catch (error) {
        
        return res.status(500).json({message: errorMsg[500], error: error.message})

    }

})

module.exports = router