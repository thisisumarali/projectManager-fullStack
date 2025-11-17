import 'dotenv/config'
import express from 'express'
import ConnectDb from './utils/db.js'
import router from './router/userauth.routes.js'
import adminRouter from './router/admin.routes.js'
import categoryRouter from './router/category.routes.js'
import productRouter from './router/product.routes.js'
import cors from 'cors'
import companyRouter from './router/company.routes.js'
import invoiceRouter from './router/invoice.routes.js'
const PORT = process.env.PORT || 5000
const app = express()
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true
}

app.use(cors(corsOptions))

app.use(express.json())

app.use('/api/userauth', router)
app.use('/api/adminauth', adminRouter)
app.use('/api/category', categoryRouter)
app.use("/api/company", companyRouter)
app.use("/api/product", productRouter)
app.use("/api/invoice", invoiceRouter)


ConnectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    })
}).catch((err) => {
    console.log('Failed to connect DB:', err)
})