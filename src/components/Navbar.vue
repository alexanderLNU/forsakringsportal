<template>
    <nav role="navigation">
        <ul class="nav__link--list">
            <li class="nav__link">
                <router-link to="/calculator" active-class="active">Calculator</router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>

<style scoped>
a {
    text-decoration: none;
    color: black;
}

nav {
    height: 100px;
}
.nav__link--list {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style-type: none;
    padding: 0;
}
.nav__link {
    position: relative;
    padding: 14px;
    margin: 0 10px;
    font-size: 24px;
}

.nav__link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 4px;
    bottom: -5px;
    left: 0;
    background-color: black;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
}

.nav__link:hover::after {
    visibility: visible;
    width: 100%;
}

.active {
    font-weight: bold;
}

</style>
