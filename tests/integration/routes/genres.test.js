const request = require('supertest')
const { Genre } = require('../../../models/genre')
const { User } = require('../../../models/user')
const mongoose = require('mongoose')

let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../../index') })
    afterEach( async () => { 
        await server.close();
        await Genre.remove({});
    })

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ])

            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()
        })
    })

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ "name": "genre" })
            await genre.save()

            const res = await request(server).get('/api/genres/' + genre._id)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404)
        })

        it('should return 404 if no genre with the given id exists', async () => {
            const id = mongoose.Types.ObjectId()
            const res = await request(server).get('/api/genres/' + id)
            expect(res.status).toBe(404)
        })

    })
  
    describe('POST /', () => {
        let token;
        let name;

        const exec = () => {
            return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name })
        }

        beforeEach(() => {
            token = new User().generateAuthToken()            
            name = 'genre1'
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 400 if genre is less than 3 characters', async () => {
            name = '12'
            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a')
            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should save the genre if it is valid', async () => {
            await exec()

            const genre = await Genre.find({ name: "genre1" })
            expect(genre).not.toBeNull()
        })

        it('should return the genre if it is valid', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')
        })
    })

    describe('PUT /:id', () => {

        let genre,token, id, newName;

        beforeEach( async () => {
            genre = new Genre({ name : "genre" })
            await genre.save()

            token = new User().generateAuthToken()
            id = genre._id
            newName = "updated"
        })

        const exec = () => {
            return request(server)
            .put('/api/genres/' + id)
            .set('x-auth-token', token)
            .send({ name: newName })
        }

        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await exec()
            expect(res.status).toBe(401)
        })

        it('should return 400 if genre name is less than 3 characters', async () => {
            newName = "ab"
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should return 400 if genre name is more than 50 characters', async () => {
            newName = new Array(52).join('a')
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should return 404 if genre id is invalid', async () => {
            id = 1
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 404 if genre with given id does not exist', async () => {
            id = new mongoose.Types.ObjectId()
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should update the genre if valid id is passed', async () => {
            await exec()
            updatedGenre = await Genre.findById(id)
            expect(updatedGenre.name).toBe("updated")
        })

        it('should return the saved genre', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', newName)
        })
    })

    describe('DELETE /:id', () => {
        let id, genre, token;

        beforeEach( async () => {
            genre = new Genre({ "name": "genre" })
            await genre.save()

            id = genre._id
            token = new User({ isAdmin: true }).generateAuthToken()
        })

        const exec = () => {
            return request(server)
            .delete('/api/genres/' + id)
            .set('x-auth-token', token)
        }

        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await exec()
            expect(res.status).toBe(401)
        })

        it('should return 403 if client is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken()
            const res = await exec()
            expect(res.status).toBe(403)
        })

        it('should return 404 if id is invalid', async () => {
            id = 1
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 404 if genre does not exist', async () => {
            id = new mongoose.Types.ObjectId()
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should delete the genre if input is valid', async () => {
            await exec()
            const genreInDb = await Genre.findById(id)
            expect(genreInDb).toBeNull()
        })
        
        it('should return deleted genre', async () => {
            const res = await exec()
            
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', genre.name)
        })
    })

})