import { createRouter, createWebHistory } from 'vue-router'

import BarberDetail from '../views/barbers/BarberDetail.vue';
import BarberList from '../views/barbers/BarberList.vue';
import BarberRegistration from '../views/barbers/BarberRegistration.vue';
import Contact from '../views/requests/Contact.vue';
import Requests from '../views/requests/Requests.vue';
import NotFound from '../views/NotFound.vue';
import About from '../views/About.vue';

const routes = [
  {
    path: '/',
    redirect: '/barbers'
  },
  {
    path: '/barbers',
    name: 'Barbers',
    component: BarberList
  },
  {
    path: '/barbers/:id',
    props: true, 
    name: 'bid',
    children: 
    [
      {
        path: 'contact',
        component: Contact
      }
    ],
    component: BarberDetail
  },
  {
    path: '/register',
    name: 'register',
    component: BarberRegistration
  },
  {
    path: '/requests',
    name: 'requests',
    component: Requests
  },
  {
    path: '/:notFound(.*)',
    name: 'notFound',
    component: NotFound
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
