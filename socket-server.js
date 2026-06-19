const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
    },
})


io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("join-order", (orderId) => {
        socket.join(`order-${orderId}`)
    })
})


app.post("/send-location", (req, res) => {
    const data = req.body

    io.to(`order-${data.order_id}`).emit("receive-location", data)

    res.json({ success: true })
})


app.post("/send-position", (req, res) => {
    const data = req.body

    io.emit("receive-position", data)

    res.json({ success: true })
})


app.post("/update-position", (req, res) => {
    const data = req.body

    io.emit("get-position", data)

    res.json({ success: true })
})

app.get("/", (req, res) => {
    res.json({
        status: true,
        message: "Socket.IO Server Running"
    });
});



server.listen(3001, () => {
    console.log("Socket server running on port 3001")
})
