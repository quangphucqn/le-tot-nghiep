(function () {
  'use strict';

  // Verified coordinates on OpenStreetMap (Overpass / Karte OSM)
  const EVENT_TIME_ISO = '2026-11-14T11:30:00+07:00';

  const VENUE = {
    id: 'ou-97',
    type: 'venue',
    code: '🎓',
    shortLabel: 'ĐH Mở (97 VVT)',
    tag: 'ĐỊA ĐIỂM TỔ CHỨC LỄ',
    name: 'Trường Đại học Mở TP.HCM',
    address: '97 Võ Văn Tần, P. Xuân Hòa (P.6 cũ), Quận 3, TP.HCM',
    coords: [10.77645, 106.69043],
    note: 'Hẹn gặp mọi người lúc 11:30 Thứ Bảy 14/11/2026. Do bãi xe trường đã hết chỗ, vui lòng gửi xe ở 1 trong 4 bãi P1–P4 bên dưới.',
    gmapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=10.77645,106.69043'
  };

  const PARKING_LOTS = [
    {
      id: 'p1-nld',
      type: 'parking',
      code: 'P1',
      shortLabel: 'Báo NLĐ (123)',
      labelPlacement: 'left',
      tag: 'GẦN NHẤT • ~1 PHÚT ĐI BỘ',
      distance: '~80m',
      walkMinutes: '~1 phút đi bộ',
      name: 'Bãi giữ xe Báo Người Lao Động',
      address: '123 Võ Văn Tần, Quận 3, TP.HCM',
      coords: [10.77586, 106.68995],
      walkPath: [
        [10.77586, 106.68995],
        [10.77615, 106.69019],
        [10.77645, 106.69043]
      ],
      note: 'Nằm ngay mặt tiền Cao ốc 123–127 Võ Văn Tần (trước khi tới cổng trường số 97 theo chiều 1 chiều). Gửi xong đi bộ thẳng 1 phút trên cùng vỉa hè là tới trường.',
      gmapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=10.77586,106.68995'
    },
    {
      id: 'p2-ocb',
      type: 'parking',
      code: 'P2',
      shortLabel: 'OCB (123–127)',
      labelPlacement: 'below',
      tag: 'CÙNG DÃY • ~1–2 PHÚT ĐI BỘ',
      distance: '~100m',
      walkMinutes: '~1–2 phút đi bộ',
      name: 'Bãi giữ xe Ngân hàng OCB',
      address: '123–127 Võ Văn Tần (góc Bà Huyện Thanh Quan), Quận 3',
      coords: [10.77575, 106.68980],
      walkPath: [
        [10.77575, 106.68980],
        [10.77586, 106.68995],
        [10.77615, 106.69019],
        [10.77645, 106.69043]
      ],
      note: 'Cùng cụm tòa nhà Cao ốc 123–127 ngay góc Võ Văn Tần – Bà Huyện Thanh Quan. Vừa qua ngã tư Bà Huyện Thanh Quan là thấy ngay bên tay phải.',
      gmapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=10.77575,106.68980'
    },
    {
      id: 'p3-taodan',
      type: 'parking',
      code: 'P3',
      shortLabel: 'CV Tao Đàn',
      labelPlacement: 'above',
      tag: 'RỘNG RÃI • ~3 PHÚT ĐI BỘ',
      distance: '~230m',
      walkMinutes: '~3 phút đi bộ',
      name: 'Bãi giữ xe Công viên Tao Đàn',
      address: 'Ngã tư Trương Định – Nguyễn Thị Minh Khai, Quận 1',
      coords: [10.77562, 106.69205],
      walkPath: [
        [10.77562, 106.69205],
        [10.77587, 106.69165],
        [10.77667, 106.69066],
        [10.77645, 106.69043]
      ],
      note: 'Chỗ gửi xe rộng rãi ngay góc ngã tư Trương Định – Nguyễn Thị Minh Khai (cổng Công viên Tao Đàn). Gửi xe xong đi bộ ngược lên đường Trương Định ~3 phút là tới cổng 97 Võ Văn Tần.',
      gmapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=10.77562,106.69205'
    },
    {
      id: 'p4-cvhld',
      type: 'parking',
      code: 'P4',
      shortLabel: 'Cung VHLĐ (55B)',
      labelPlacement: 'above',
      tag: 'RỘNG RÃI • ~3–4 PHÚT ĐI BỘ',
      distance: '~250m',
      walkMinutes: '~3–4 phút đi bộ',
      name: 'Bãi giữ xe Cung Văn hóa Lao động',
      address: '55B Nguyễn Thị Minh Khai, P. Bến Thành, Quận 1',
      coords: [10.77665, 106.69265],
      walkPath: [
        [10.77665, 106.69265],
        [10.77673, 106.69234],
        [10.77600, 106.69166],
        [10.77667, 106.69066],
        [10.77645, 106.69043]
      ],
      note: 'Bãi giữ xe rộng rãi ngay cạnh Công viên Tao Đàn, mặt tiền 55B Nguyễn Thị Minh Khai (có lối gửi xe phía đường Trương Định và Huyền Trân Công Chúa). Đi bộ ra ngã tư Trương Định rồi ngược lên 97 Võ Văn Tần.',
      gmapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=10.77665,106.69265'
    }
  ];

  const ALL_LOCATIONS = [VENUE, ...PARKING_LOTS];

  const TILE_SOURCES = {
    google: {
      url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi',
      options: {
        subdomains: '0123',
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      }
    },
    osmde: {
      url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
      options: {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap Deutschland'
      }
    },
    satellite: {
      url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=vi',
      options: {
        subdomains: '0123',
        maxZoom: 20,
        attribution: '&copy; Google Satellite'
      }
    }
  };

  let map = null;
  let activeTileLayer = null;
  let activeLayerKey = 'google';
  let tileErrorCount = 0;
  let hasAutoSwitched = false;
  let routePolyline = null;
  let oneWayGroup = null;
  let oneWayVisible = true;
  let userLocationMarker = null;
  let selectedId = 'p1-nld';
  const markerMap = new Map();

  // ==================== COUNTDOWN ====================
  function updateCountdown() {
    const el = document.getElementById('countdown-pill');
    if (!el) return;
    const now = new Date();
    const target = new Date(EVENT_TIME_ISO);
    const diffMs = target.getTime() - now.getTime();

    if (diffMs <= -3 * 3600 * 1000) {
      el.textContent = '14/11/2026 • Cảm ơn bạn đã tham dự!';
      return;
    }
    if (diffMs <= 0) {
      el.textContent = '🎉 Đang diễn ra hôm nay • 11:30';
      return;
    }

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const mins = totalMinutes % 60;

    if (days >= 1) {
      el.textContent = `⏳ Còn ${days} ngày ${hours} giờ (14/11 • 11:30)`;
    } else if (hours >= 1) {
      el.textContent = `⏳ Hôm nay • Còn ${hours} giờ ${mins} phút nữa`;
    } else {
      el.textContent = `⏳ Sắp bắt đầu • Còn ${mins} phút nữa`;
    }
  }

  // ==================== TOAST ====================
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  // ==================== CARDS RENDERING ====================
  function renderCards() {
    const container = document.getElementById('location-cards');
    if (!container) return;

    container.innerHTML = ALL_LOCATIONS.map((loc) => {
      const isVenue = loc.type === 'venue';
      const cardClass = [
        'loc-card',
        isVenue ? 'is-venue' : '',
        loc.id === selectedId ? 'is-selected' : ''
      ].filter(Boolean).join(' ');

      const badgeClass = isVenue ? 'loc-badge loc-badge--venue' : 'loc-badge loc-badge--parking';
      const tagsHtml = isVenue
        ? `<span class="loc-tag loc-tag--venue">${loc.tag}</span>`
        : `<span class="loc-tag loc-tag--walk">🚶 ${loc.walkMinutes}</span>
           <span class="loc-tag loc-tag--distance">📏 Cách ${loc.distance}</span>`;

      return `
        <article class="${cardClass}" data-id="${loc.id}">
          <div class="loc-top">
            <div class="${badgeClass}" aria-hidden="true">${loc.code}</div>
            <div class="loc-header-text">
              <div class="loc-tag-row">${tagsHtml}</div>
              <h3 class="loc-title">${loc.name}</h3>
              <p class="loc-address">${loc.address}</p>
            </div>
          </div>
          <p class="loc-note">${loc.note}</p>
          <div class="loc-actions">
            <button type="button" class="card-btn card-btn--focus" data-focus-id="${loc.id}">
              🗺️ Xem trên bản đồ
            </button>
            <a class="card-btn card-btn--gmaps" href="${loc.gmapsUrl}" target="_blank" rel="noopener noreferrer">
              📍 Chỉ đường Google Maps
            </a>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('[data-focus-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-focus-id');
        selectLocation(id, { openPopup: false, scrollToMapOnMobile: true });
      });
    });

    container.querySelectorAll('.loc-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        const id = card.getAttribute('data-id');
        selectLocation(id, { openPopup: false, scrollToMapOnMobile: false });
      });
    });
  }

  function updateCardSelectionUI() {
    document.querySelectorAll('.loc-card').forEach((card) => {
      card.classList.toggle('is-selected', card.getAttribute('data-id') === selectedId);
    });
  }

  // ==================== MAP SETUP ====================
  function createPinIcon(loc, isActive) {
    const cls = [
      'pin-pill',
      loc.type === 'venue' ? 'pin-pill--venue' : 'pin-pill--parking',
      loc.labelPlacement === 'below' ? 'pin-pill--below' : '',
      loc.labelPlacement === 'left' ? 'pin-pill--left' : '',
      isActive ? 'is-active' : ''
    ].filter(Boolean).join(' ');

    const dotCls = loc.type === 'venue' ? 'pin-dot pin-dot--venue' : 'pin-dot';

    const html = `
      <span class="${dotCls}"></span>
      <div class="${cls}">
        <span class="pin-code">${loc.code}</span>
        <span>${loc.shortLabel}</span>
      </div>
    `;

    return L.divIcon({
      className: 'custom-marker-wrap',
      html,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: loc.labelPlacement === 'below' ? [0, -10] : [0, -38]
    });
  }

  function createPopupHtml(loc) {
    const subtitle = loc.type === 'venue'
      ? loc.tag
      : `${loc.walkMinutes} (${loc.distance}) tới trường`;

    return `
      <div class="popup-box">
        <div class="popup-kicker">${subtitle}</div>
        <h4 class="popup-title">${loc.name}</h4>
        <p class="popup-addr">${loc.address}</p>
        <a class="popup-cta" href="${loc.gmapsUrl}" target="_blank" rel="noopener noreferrer">
          Chỉ đường bằng Google Maps ↗
        </a>
      </div>
    `;
  }

  function setTileLayer(key) {
    if (!map || !TILE_SOURCES[key]) return;
    activeLayerKey = key;
    tileErrorCount = 0;

    if (activeTileLayer) {
      map.removeLayer(activeTileLayer);
    }

    const cfg = TILE_SOURCES[key];
    activeTileLayer = L.tileLayer(cfg.url, cfg.options);

    activeTileLayer.on('tileerror', () => {
      tileErrorCount += 1;
      if (tileErrorCount >= 4 && !hasAutoSwitched) {
        hasAutoSwitched = true;
        const fallbackOrder = ['osmde', 'google', 'satellite'];
        const nextKey = fallbackOrder.find((k) => k !== activeLayerKey);
        if (nextKey) {
          setTileLayer(nextKey);
          syncLayerButtons(nextKey);
        }
      }
    });

    activeTileLayer.addTo(map);
  }

  function syncLayerButtons(key) {
    document.querySelectorAll('.map-style-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-layer') === key);
    });
  }

  function buildOneWayLayer() {
    oneWayGroup = L.layerGroup();

    // Võ Văn Tần one-way SW -> NE
    L.polyline(
      [
        [10.77525, 106.68938],
        [10.77695, 106.69076]
      ],
      {
        color: '#102542',
        weight: 2.5,
        opacity: 0.45,
        dashArray: '4 8'
      }
    ).addTo(oneWayGroup);

    L.marker([10.77512, 106.68928], {
      interactive: false,
      icon: L.divIcon({
        className: 'custom-marker-wrap',
        html: '<div class="oneway-badge">Võ Văn Tần 1 chiều ↗</div>',
        iconSize: [0, 0]
      })
    }).addTo(oneWayGroup);

    // Trương Định one-way NW -> SE
    L.polyline(
      [
        [10.77698, 106.69027],
        [10.77545, 106.69216]
      ],
      {
        color: '#102542',
        weight: 2.5,
        opacity: 0.4,
        dashArray: '4 8'
      }
    ).addTo(oneWayGroup);

    L.marker([10.77495, 106.69262], {
      interactive: false,
      icon: L.divIcon({
        className: 'custom-marker-wrap',
        html: '<div class="oneway-badge">Trương Định 1 chiều ↘</div>',
        iconSize: [0, 0]
      })
    }).addTo(oneWayGroup);

    // Nguyễn Thị Minh Khai one-way SW -> NE
    L.polyline(
      [
        [10.77455, 106.69030],
        [10.77755, 106.69310]
      ],
      {
        color: '#102542',
        weight: 2.5,
        opacity: 0.4,
        dashArray: '4 8'
      }
    ).addTo(oneWayGroup);

    L.marker([10.77492, 106.69065], {
      interactive: false,
      icon: L.divIcon({
        className: 'custom-marker-wrap',
        html: '<div class="oneway-badge">Nguyễn Thị Minh Khai 1 chiều ↗</div>',
        iconSize: [0, 0]
      })
    }).addTo(oneWayGroup);

    if (oneWayVisible) {
      oneWayGroup.addTo(map);
    }
  }

  function updateWalkingRoute(loc) {
    const banner = document.getElementById('route-banner');
    const badge = document.getElementById('route-banner-badge');
    const title = document.getElementById('route-banner-title');
    const meta = document.getElementById('route-banner-meta');
    const gmapsLink = document.getElementById('route-banner-gmaps');

    if (routePolyline) {
      map.removeLayer(routePolyline);
      routePolyline = null;
    }

    if (!loc || loc.type === 'venue') {
      if (banner) {
        badge.textContent = '🎓';
        title.textContent = VENUE.name;
        meta.textContent = VENUE.address;
        gmapsLink.href = VENUE.gmapsUrl;
        banner.hidden = false;
      }
      return;
    }

    routePolyline = L.polyline(loc.walkPath, {
      color: '#0f766e',
      weight: 5,
      opacity: 0.92,
      dashArray: '8 8',
      className: 'walking-dash'
    }).addTo(map);

    if (banner) {
      badge.textContent = loc.code;
      title.textContent = `${loc.name} → ĐH Mở (97 VVT)`;
      meta.textContent = `${loc.walkMinutes} (${loc.distance}) • ${loc.address}`;
      gmapsLink.href = loc.gmapsUrl;
      banner.hidden = false;
    }
  }

  function selectLocation(id, options = {}) {
    const loc = ALL_LOCATIONS.find((item) => item.id === id);
    if (!loc) return;
    selectedId = id;
    updateCardSelectionUI();

    if (map) {
      ALL_LOCATIONS.forEach((item) => {
        const marker = markerMap.get(item.id);
        if (marker) {
          marker.setIcon(createPinIcon(item, item.id === selectedId));
          marker.setZIndexOffset(item.id === selectedId ? 1000 : (item.type === 'venue' ? 500 : 100));
        }
      });

      updateWalkingRoute(loc);

      if (loc.type === 'parking') {
        const bounds = L.latLngBounds([loc.coords, VENUE.coords]);
        map.fitBounds(bounds, {
          paddingTopLeft: [50, 75],
          paddingBottomRight: [50, 95],
          maxZoom: 18,
          animate: true
        });
      } else {
        map.setView(loc.coords, 18, { animate: true });
      }

      const targetMarker = markerMap.get(loc.id);
      if (targetMarker && options.openPopup !== false) {
        setTimeout(() => {
          targetMarker.openPopup();
        }, 250);
      } else {
        map.closePopup();
      }
    }

    if (options.scrollToMapOnMobile && window.innerWidth < 960) {
      const mapEl = document.getElementById('ban-do');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function fitAllMarkers() {
    if (!map) return;
    const bounds = L.latLngBounds(ALL_LOCATIONS.map((l) => l.coords));
    map.fitBounds(bounds, {
      paddingTopLeft: [70, 72],
      paddingBottomRight: [82, 108],
      maxZoom: 17,
      animate: true
    });
  }

  function initMap() {
    if (typeof window.L === 'undefined') {
      const mapEl = document.getElementById('map');
      if (mapEl) {
        mapEl.innerHTML = '<div style="padding:2rem;text-align:center;color:#334155;">Không tải được thư viện bản đồ. Vui lòng dùng các nút <strong>Chỉ đường Google Maps</strong> ở danh sách bên cạnh!</div>';
      }
      return;
    }

    map = L.map('map', {
      center: [10.77605, 106.6908],
      zoom: 17,
      zoomControl: true,
      scrollWheelZoom: false
    });

    setTileLayer(activeLayerKey);
    buildOneWayLayer();

    ALL_LOCATIONS.forEach((loc) => {
      const marker = L.marker(loc.coords, {
        icon: createPinIcon(loc, loc.id === selectedId),
        zIndexOffset: loc.type === 'venue' ? 500 : 100
      })
        .bindPopup(createPopupHtml(loc), { offset: [0, -8] })
        .addTo(map);

      marker.on('click', () => {
        selectLocation(loc.id, { openPopup: true, scrollToMapOnMobile: false });
      });

      markerMap.set(loc.id, marker);
    });

    // Show overview first + P1 walking route highlight
    fitAllMarkers();
    const initialLoc = PARKING_LOTS[0];
    updateWalkingRoute(initialLoc);
  }

  // ==================== ACTIONS ====================
  function setupControls() {
    // Map layer switcher
    document.querySelectorAll('.map-style-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const layer = btn.getAttribute('data-layer');
        syncLayerButtons(layer);
        setTileLayer(layer);
      });
    });

    // Toggle 1-way overlay
    const oneWayBtn = document.getElementById('toggle-oneway-btn');
    if (oneWayBtn) {
      oneWayBtn.addEventListener('click', () => {
        if (!map || !oneWayGroup) return;
        oneWayVisible = !oneWayVisible;
        oneWayBtn.classList.toggle('is-active', oneWayVisible);
        if (oneWayVisible) {
          oneWayGroup.addTo(map);
        } else {
          map.removeLayer(oneWayGroup);
        }
      });
    }

    // Reset zoom to all markers
    const resetBtn = document.getElementById('reset-map-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (map) {
          map.closePopup();
          fitAllMarkers();
        }
      });
    }

    // User geolocation
    const locateBtn = document.getElementById('locate-btn');
    if (locateBtn) {
      locateBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          showToast('Trình duyệt không hỗ trợ định vị GPS.');
          return;
        }
        showToast('Đang xác định vị trí của bạn...');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const latlng = [pos.coords.latitude, pos.coords.longitude];
            if (!map) return;
            if (userLocationMarker) {
              map.removeLayer(userLocationMarker);
            }
            userLocationMarker = L.circleMarker(latlng, {
              radius: 8,
              color: '#ffffff',
              weight: 3,
              fillColor: '#2563eb',
              fillOpacity: 1
            })
              .bindPopup('<strong>Vị trí hiện tại của bạn</strong>')
              .addTo(map);
            const bounds = L.latLngBounds([latlng, VENUE.coords]);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
            userLocationMarker.openPopup();
          },
          () => {
            showToast('Chưa lấy được vị trí (bạn có thể bấm Chỉ đường Google Maps trực tiếp).');
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      });
    }

    // Share / Copy URL button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const shareData = {
          title: 'Lễ Tốt Nghiệp Trần Quang Phục (14/11 • 11:30)',
          text: 'Mời bạn đến dự lễ tốt nghiệp của Phục tại ĐH Mở TP.HCM (97 Võ Văn Tần) lúc 11:30 Thứ Bảy 14/11. Xem bản đồ 4 bãi giữ xe gần trường ở đây nhé:',
          url: window.location.href
        };

        if (navigator.share) {
          try {
            await navigator.share(shareData);
            return;
          } catch (_) {
            // Fall through to clipboard copy if dismissed or unsupported
          }
        }

        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('Đã copy link! Bạn có thể dán gửi qua Zalo / Messenger.');
        } catch (_) {
          showToast('Link trang: ' + window.location.href);
        }
      });
    }

    // Download .ics calendar file
    const icsBtn = document.getElementById('ics-btn');
    if (icsBtn) {
      icsBtn.addEventListener('click', () => {
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Tran Quang Phuc//Le Tot Nghiep 2026//VI',
          'CALSCALE:GREGORIAN',
          'BEGIN:VEVENT',
          'UID:tot-nghiep-tran-quang-phuc-20261114@quangphucqn.github.io',
          'DTSTAMP:20261113T023000Z',
          'DTSTART:20261114T043000Z',
          'DTEND:20261114T063000Z',
          'SUMMARY:Lễ Tốt Nghiệp Trần Quang Phục - ĐH Mở TP.HCM',
          'LOCATION:Trường Đại học Mở TP.HCM, 97 Võ Văn Tần, Quận 3, TP.HCM',
          'DESCRIPTION:Trường hết chỗ gửi xe. Các bãi gửi xe gần trường: (1) Báo Người Lao Động 123 Võ Văn Tần, (2) Ngân hàng OCB 123-127 Võ Văn Tần, (3) Công viên Tao Đàn (Ngã tư Trương Định - Nguyễn Thị Minh Khai), (4) Cung Văn hóa Lao động 55B Nguyễn Thị Minh Khai.',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Le-Tot-Nghiep-Tran-Quang-Phuc-14-11.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Đã tải file lịch hẹn (.ics) cho ngày 14/11 lúc 11:30!');
      });
    }
  }

  // ==================== BOOTSTRAP ====================
  document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 30000);
    renderCards();
    setupControls();

    // Ensure Leaflet is loaded even if fallback script was injected asynchronously
    if (typeof window.L !== 'undefined') {
      initMap();
    } else {
      window.addEventListener('load', initMap, { once: true });
    }
  });
})();
