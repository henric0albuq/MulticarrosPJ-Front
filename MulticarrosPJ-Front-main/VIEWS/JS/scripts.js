/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    // If there's no #sidebarToggle element in the markup, inject a simple
    // hamburger button into the `.topbar` so mobile users can open the drawer.
    function ensureHamburger() {
        const topbar = document.body.querySelector('.topbar');
        if (!topbar) return;

        let btn = document.getElementById('sidebarToggle');
        if (btn) return; // already exists

        btn = document.createElement('button');
        btn.id = 'sidebarToggle';
        btn.className = 'hamburger-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Abrir menu');
        btn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';

        // Prefer to place the hamburger next to the search input if present
        const search = topbar.querySelector('.search');
        if (search && search.parentNode) {
            // insert before the search element so it appears left of the search box
            search.parentNode.insertBefore(btn, search);
        } else {
            topbar.insertBefore(btn, topbar.firstChild);
        }

        // Add backdrop element
        if (!document.getElementById('sidebarBackdrop')) {
            const backdrop = document.createElement('div');
            backdrop.id = 'sidebarBackdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', () => {
                document.body.classList.remove('sb-sidenav-toggled');
            });
        }

        // Wire the button to toggle the body class used by CSS
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
        });

        // Close sidebar when a menu link is clicked (better UX on mobile)
        const menu = document.getElementById('menu');
        if (menu) {
            menu.addEventListener('click', (ev) => {
                const target = ev.target.closest('a');
                if (target) {
                    // small delay so navigation feels natural (if link navigates)
                    document.body.classList.remove('sb-sidenav-toggled');
                }
            });
        }

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') document.body.classList.remove('sb-sidenav-toggled');
        });
    }

    ensureHamburger();

    /* -- Calendar / Google Agenda (simple local view) -- */
    function startOfWeek(date) {
        // Monday as first day
        const d = new Date(date);
        const day = (d.getDay() + 6) % 7; // 0=Monday
        d.setDate(d.getDate() - day);
        d.setHours(0,0,0,0);
        return d;
    }

    function formatDateKey(d) {
        return d.toISOString().slice(0,10);
    }

    function loadEvents() {
        try {
            const raw = localStorage.getItem('agenda.events');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveEvents(evts) {
        localStorage.setItem('agenda.events', JSON.stringify(evts));
    }

    function renderWeek() {
        const container = document.getElementById('weekGrid');
        if (!container) return;
        container.innerHTML = '';

        const today = new Date();
        const weekStart = startOfWeek(today);
        const events = loadEvents();

        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            const key = formatDateKey(day);

            const cell = document.createElement('div');
            cell.className = 'day-cell';

            const name = document.createElement('div');
            name.className = 'day-name';
            name.textContent = day.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });
            cell.appendChild(name);

            const list = document.createElement('div');
            list.className = 'events-list';

            const dayEvents = events.filter(e => e.date === key).sort((a,b)=> a.time.localeCompare(b.time));
            if (dayEvents.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'muted';
                empty.textContent = '— nenhum agendamento —';
                list.appendChild(empty);
            } else {
                dayEvents.forEach(ev => {
                    const evEl = document.createElement('div');
                    evEl.className = 'event';
                    evEl.textContent = `${ev.time} • ${ev.title}`;
                    list.appendChild(evEl);
                });
            }

            cell.appendChild(list);

            container.appendChild(cell);
        }
    }

    // add some sample events for demonstration
    document.getElementById('addSample')?.addEventListener('click', () => {
        const base = startOfWeek(new Date());
        const samples = [
            { date: formatDateKey(base), time: '09:30', title: 'Visita: João Silva' },
            { date: formatDateKey(new Date(base.getFullYear(), base.getMonth(), base.getDate()+1)), time: '11:00', title: 'Visita: Maria' },
            { date: formatDateKey(new Date(base.getFullYear(), base.getMonth(), base.getDate()+3)), time: '15:00', title: 'Visita: Carlos' },
            { date: formatDateKey(new Date(base.getFullYear(), base.getMonth(), base.getDate()+5)), time: '10:00', title: 'Visita: Oficina' }
        ];
        const events = loadEvents();
        const merged = events.concat(samples);
        saveEvents(merged);
        renderWeek();
    });

    // Clear stored events (with confirmation)
    document.getElementById('clearEvents')?.addEventListener('click', () => {
        if (!confirm('Tem certeza que deseja remover todos os agendamentos?')) return;
        localStorage.removeItem('agenda.events');
        renderWeek();
    });

    // initial render
    renderWeek();

});

