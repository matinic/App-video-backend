const errorMsg = require('../errors')
const router = (require('express')).Router()
const auth = (require('../middlewares/JWT_verifyToken'))
const {user} = (require('../db')).models

router.post('/',auth, async(req,res)=>{

    //This is the user who press the subscription button
    const username = req.username

    //This is the Id from the channel who the user wants to subscribe
    const subscriptionId = req.body?.id

    //If no id is sent to the server the error message is send
    if(!subscriptionId) return res.status(400).json({message: errorMsg[400]})

    try {
        //Search for the user in the database
        const userFounded = await user.findOne({ where: {username: username}})

        //If no user is founded, send an error message
        if(!userFounded) return res.status(404).json({message: errorMsg['404_user'], error: {userFounded}})

        //Search for the subscription channel in the database
        const subscriptionFounded = await user.findByPk(subscriptionId)

        //If the channel is not founded, an error message is send
        if(!subscriptionFounded) return res.status(404).json({message: errorMsg['404_user'], error: {subscriptionFounded}})

        //If the user id and channel id are the same an error response is send
        if(userFounded.id === subscriptionId) return res.status(403).json({message: "User and subscription cannot be the same"})

        //Ask if the user already is subscribed to the channel, checking the subscription list on the userFounded side
        const isSubscriptionExist = userFounded.subscriptions?.includes(subscriptionId)

        //If the susbcription already exist, both id's will be deleted fron their respective lists: followers on the subscriptionFounded and subscriptions on the userFounded
        if(isSubscriptionExist){
            //delete subscription id from the list
            const indexOfSubscription = userFounded.subscriptions.indexOf(subscriptionId)
            userFounded.subscriptions.splice(indexOfSubscription,1)
            userFounded.changed("subscriptions",true)
            //Save changes in the record
            await userFounded.save()
            //delete follower id from the list
            const indexOfFollower = subscriptionFounded.followers.indexOf(userFounded.id)
            subscriptionFounded.followers.splice(indexOfFollower,1)
            subscriptionFounded.changed("followers",true)
             //Update the followers counter
            subscriptionFounded.followersCount = subscriptionFounded.followers.length
            //save the changes
            await subscriptionFounded.save()
            //send the response
            return res.status(200).json({message: "Subscription removed"})
        }
        //If it is the 1st time the user subscribe to a channel the subscriptions list must be set first on [] to do the next actions
        if(!userFounded.subscriptions) userFounded.subscriptions = []
        //Add the id to the subscriptions list
        userFounded.subscriptions.push(subscriptionId)
        userFounded.changed("subscriptions",true)
        //Save the changes
        await userFounded.save()
        //If it is the first time a channel get a follower, the list on the subscriptionFouned must be set as [] 
        if(!subscriptionFounded.followers) subscriptionFounded.followers = []
        //Add the id of the follower to the list
        subscriptionFounded.followers.push(userFounded.id)
        subscriptionFounded.changed("subscriptions",true)
         //Update the followers counter
        subscriptionFounded.followersCount = subscriptionFounded.followers.length
        //save the changes
        await subscriptionFounded.save()
        //If all went rigth send the message
        return res.status(200).json({message: "subscription added"})
    } catch (error) {
        
        return res.status(500).json({message: errorMsg[500], error: error.message})

    }

})

module.exports = router