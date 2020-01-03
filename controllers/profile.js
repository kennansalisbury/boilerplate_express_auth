let axios = require('axios')
let router = require('express').Router()
let isLoggedIn = require('../middleware/isLoggedIn')
let isAdminLoggedIn = require('../middleware/isAdminLoggedIn')

//GET /profile non-admin
router.get('/', isLoggedIn, (req, res) => {
    res.render('profile/main')
})

//GET /profile/admin
router.get('/admin', (req, res) => {
    res.render('profile/admin')
})

//GET /profile/repos
router.get('/repos', isLoggedIn, (req, res) => {
    let page = parseInt(req.query.page) || 1
    if (req.user.githubToken) { 
        axios.get('https://api.github.com/user/repos?per_page=10&page=' + page, {
            headers: {
                Authorization: `token ${req.user.githubToken}`,
                'User-Agent': 'Kennan-OAuth-Boilerplate'
            }
        })
        .then(response => {
            
            console.log(response.data)
            res.render('profile/repos', {repos: response.data, page})
        })
        .catch(err => {
            console.log(err)
            res.render('error')
        })
    } else {
        res.render('profile/repos', {repos: null, page})
    }
})

module.exports = router