$(document).ready(function(){

    //------------------------------------------------------------------------------------------ //
    // Links
    //------------------------------------------------------------------------------------------ //

    const registrationContents = document.querySelectorAll('.content');
    const registrationContentActiveClass = "content--selected";
    const registrationControlsButtons = document.querySelectorAll('.registration-controls__button');
    const registrationControlsButtonActiveClass = 'registration-controls__button--selected'; 
    const registrationGridItems = document.querySelectorAll('.bonuses-grid--registration .bonuses-grid__item');
    const formGridItems = document.querySelectorAll('.bonuses-grid--form .bonuses-grid__item');
    const formDropdown = document.querySelector('.form-dropdown__inner');
    const formDropdownList = document.querySelector('.form-dropdown__list');
    const formDropdownItems = document.querySelectorAll('.form-dropdown__item');
    let formDropdownSelectedItem = document.querySelector('.form-dropdown__selected');

    if (formDropdown && formDropdownList) {
        const activeClass = 'form-dropdown__inner--active';
        const activeListClass = 'form-dropdown__list--active';

        formDropdown.addEventListener('click', (e) => {
            const wrapper = e.target;
            wrapper.classList.toggle(activeClass);
            if (wrapper.classList.contains(activeClass)) {
                formDropdownList.classList.add(activeListClass)
            } else {
                formDropdownList.classList.remove(activeListClass);
            }
        })
        formDropdownItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                const itemContent = e.target.textContent;
                formDropdownList.classList.remove(activeListClass);
                if (itemContent !== formDropdownSelectedItem.textContent) {
                    formDropdownSelectedItem.textContent = itemContent;
                }
            })
        })
    }

    const handleBonusItemOpacity = (items) => {
        items.forEach((gridItem, i) => gridItem.style.opacity = `${1 - i * 0.08}`)
    }

    if (registrationGridItems.length > 0) handleBonusItemOpacity(registrationGridItems);

    if (formGridItems.length > 0) handleBonusItemOpacity(formGridItems);

    if (registrationControlsButtons.length > 0) {
        registrationControlsButtons.forEach((button, i) => {
            button.addEventListener('click', () => {
                registrationControlsButtons.forEach(btn => {
                    if (btn.classList.contains(registrationControlsButtonActiveClass)) {
                        btn.classList.remove(registrationControlsButtonActiveClass);
                    }
                })
                button.classList.add(registrationControlsButtonActiveClass);
                if (button.classList.contains(registrationControlsButtonActiveClass)) {
                    registrationContents.forEach(
                        content => content.classList.remove(registrationContentActiveClass)
                    );
                    registrationContents[i].classList.add(registrationContentActiveClass);
                }
            })
        })
    };

    const navLinks = document.querySelectorAll('.nav__links-droplink');
    const navBoxes = document.querySelectorAll('.nav__links-dropbox');

    document.querySelectorAll('.nav__links li').forEach(element => {

        const button = element.querySelector('.nav__links-droplink');
        const box = element.querySelector('.nav__links-dropbox');

        if(!button || !box)
            return;

        button.addEventListener('click', event => {
            event.preventDefault();

            if(button.classList.contains('active'))
            {
                button.classList.remove('active');
                box.classList.remove('active');
            }
            else
            {
                button.classList.add('active');
                box.classList.add('active');
            }

            navLinks.forEach(navLink => {
                if(!navLink.isEqualNode(button))
                    navLink.classList.remove('active');
            });

            navBoxes.forEach(navBox => {
                if(!navBox.isEqualNode(box))
                    navBox.classList.remove('active');
            });

        });

        document.addEventListener( 'click', (e) => {
            const withinBoundaries = e.composedPath().includes(element);

            if(!withinBoundaries) {
                button.classList.remove('active');
                box.classList.remove('active');
            }
        })

    });

    document.querySelectorAll('.open-main-menu').forEach(button => {
        const navigation = document.querySelector('.nav__links');

        if(!navigation)
            return;

        button.addEventListener('click', event => {
            event.preventDefault();

            if(button.classList.contains('active'))
            {
                button.classList.remove('active');
                navigation.classList.remove('active');
            }
            else
            {
                button.classList.add('active');
                navigation.classList.add('active');
            }
        });

        document.addEventListener( 'click', (e) => {
            if(!e.composedPath().includes(navigation) && !e.composedPath().includes(button)) {
                button.classList.remove('active');
                navigation.classList.remove('active');
            }
        });

    });

    function checkStartButton() {
        const navStartButton = document.querySelector('.nav .nav__button');
        let marker1 = $(document).scrollTop() + 50;
        let marker2 = $(document).scrollTop() + $(window).outerHeight() - 50;
        let pos1 = $('.header__content').offset().top;
        let pos2 = $('.header__content').offset().top + $('.header__content').outerHeight();

        if(marker2 > pos1 && pos2 > marker1) {
            navStartButton.classList.remove('active');
        }
        else {
            navStartButton.classList.add('active');
        }
    }

    checkStartButton();

    $(this).scroll(function (e) {
        checkStartButton();
    });


    //------------------------------------------------------------------------------------------ //
    // Languages
    //------------------------------------------------------------------------------------------ //

    document.querySelectorAll('.nav__langs').forEach(langs => { 
        const button = langs.querySelector('.nav__langs-current');

        button.addEventListener('click', event => {
            if(!langs.classList.contains('active'))
                langs.classList.add('active');
            else
                langs.classList.remove('active');
        });

        document.addEventListener( 'click', (e) => {
            if(!e.composedPath().includes(langs)) {
                langs.classList.remove('active');
            }
        });
    });

    //------------------------------------------------------------------------------------------ //
    // Reviews
    //------------------------------------------------------------------------------------------ //

    document.querySelectorAll('.update').forEach(element => {
        const update = new Swiper(element.querySelector('.update__slider'), {
            slidesPerView: 1,
            spaceBetween: 0,
            watchSlidesProgress: true,
            centeredSlides: true,
            allowTouchMove: false,
            on: {
                init: function (swiper) {
                    const today = new Date();
                    const day = today.getDate();
                    const month = today.getMonth() + 1;
                    const year = today.getFullYear();
                    const todayString = (day < 10 ? '0' + day : day) + '.' + (month < 10 ? '0' + month : month) + '.' + year;
                    const todaySlide = element.querySelector('.update__item[data-date="'+todayString+'"]');
                    swiper.slideTo(todaySlide.getAttribute('data-index'), 0);
                },
            }
        });

        const prevButton = element.querySelector('.update__arrow--prev');
        const nextButton = element.querySelector('.update__arrow--next');
        const slides = Array.from(element.querySelectorAll('.update__item.event, .update__item.today'));

        prevButton.addEventListener('click', event => {
            let prevSlide = null;
            slides.forEach((slide) => {
                if(update.activeIndex == slide.getAttribute('data-index') && prevSlide != null)
                    update.slideTo(prevSlide.getAttribute('data-index'), 500);
                prevSlide = slide;
            });
        });

        nextButton.addEventListener('click', event => {
            let prevSlide = null;
            let reverseSlides = [...slides].reverse();
            reverseSlides.forEach((slide) => {
                if(update.activeIndex == slide.getAttribute('data-index') && prevSlide != null)
                    update.slideTo(prevSlide.getAttribute('data-index'), 500);
                prevSlide = slide;
            });
        });
    });

    //------------------------------------------------------------------------------------------ //
    // Cards
    //------------------------------------------------------------------------------------------ //

    document.querySelectorAll('.rotation-card').forEach(card => { 
        card.addEventListener('click', event => {
            card.classList.toggle('rotated');
        });
    });

    //------------------------------------------------------------------------------------------ //
    // Gameplay
    //------------------------------------------------------------------------------------------ //

    $('.gameplay').MVisionToggleClass({
		classButton: 'gameplay__nav-item',
		toggleClassButton: 'active',
		dataButtonAttr: 'data-tab-open',
		classBox: 'gameplay__item',
		toggleClassBox: 'active',
		dataBoxAttr: 'data-tab-name',
		defaultElement: true,
		defaultIndexElement: 0,
	});
    
    //------------------------------------------------------------------------------------------ //
    // Players
    //------------------------------------------------------------------------------------------ //

    const players = [];

    document.querySelectorAll('.audio-player, .video-player').forEach(element => {
        let player;
        if(element.classList.contains('audio-player'))
            player = new AudioPlayer(element);
        else if(element.classList.contains('video-player'))
            player = new VideoPlayer(element);
        else
            return;
        players.push(player);
        player.onPlayStart(event => {
            players
                .filter(p => p !== player)
                .map(p => p.pause());
        });
    });

    //------------------------------------------------------------------------------------------ //
    // Reviews
    //------------------------------------------------------------------------------------------ //

    document.querySelectorAll('.reviews').forEach(element => {
        const reviews = new Swiper(element.querySelector('.reviews__slider'), {
            slidesPerView: 4,
            spaceBetween: 60,
            watchSlidesProgress: true,
            autoHeight: true,
            navigation: {
                prevEl: element.querySelector('.reviews__arrow--prev'),
                nextEl: element.querySelector('.reviews__arrow--next'),
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                },
                641: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1025: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1241: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
                1681: {
                    slidesPerView: 4,
                    spaceBetween: 60,
                },
            }
        });
    });

    //------------------------------------------------------------------------------------------ //
    // Scroll effects
    //------------------------------------------------------------------------------------------ //
    
    const fadeElements = document.querySelectorAll('[data-fade-effect]');
    checkFadeElements(fadeElements);

    $(this).scroll(function (e) {
        checkFadeElements(fadeElements);
    });

    function checkFadeElements(fadeElements) {
        fadeElements.forEach(element => {

            let marker1 = $(document).scrollTop() + 50;
            let marker2 = $(document).scrollTop() + $(window).outerHeight() - 50;
            let pos1 = $(element).offset().top;
            let pos2 = $(element).offset().top + $(element).outerHeight();

            setTimeout(function(){
                if(marker2 > pos1 && pos2 > marker1) {
                    element.classList.add('visible');
                }
                else {
                    element.classList.remove('visible');
                }
            }, 100);
        });
    }

    //------------------------------------------------------------------------------------------ //
    // Popup
    //------------------------------------------------------------------------------------------ //

    function showPopup(id)
    {
        $('.popup').each(function (event) {
            if($(this).hasClass('active'))
            {
                $(this).find('.popup__content').removeClass('active');
                setTimeout(function(){
                    $(this).find('.popup__bg').removeClass('active');

                    setTimeout(function(){
                        $(this).removeClass('active');
                        $(this).find('.popup__content').find('.popup__layout').remove();
                    }, 301);
                }, 300);
                
            }
        });

        $('.popup[data-popup-name='+id+']').addClass('active');
        setTimeout(function(){
            $('.popup[data-popup-name='+id+']').find('.popup__bg').addClass('active');
        }, 1);
        setTimeout(function(){
            $('.popup[data-popup-name='+id+']').find('.popup__content').addClass('active');
        }, 300);
    }

    function hidePopup()
    {
        $('.popup').find('.popup__content').removeClass('active');
        setTimeout(function(){
            $('.popup').find('.popup__bg').removeClass('active');
            setTimeout(function(){
                $('.popup').removeClass('active');
                $('.popup').find('.popup__layout--video').remove();
            }, 301);
        }, 300);
    }

    $('*[data-popup-open]').click(function(event){
        event.preventDefault();

        let id = $(this).attr('data-popup-open');
        let video_id = $(this).attr('data-video-id') ?? null;

        if(video_id)
        {
            let video_player = '<div class="popup__layout popup__layout--video"><iframe width="100%" height="100%" src="' + video_id + '?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
            $('.popup[data-popup-name='+id+']').find('.popup__layout').html(video_player);
        }

        showPopup(id);
    });

    // Закрытие окна с помощью крестика либо клика вне окна
    $('.popup__bg, .popup__cancel').click(function(event){
        event.preventDefault();
        hidePopup();
    });

    //------------------------------------------------------------------------------------------ //
    // Points
    //------------------------------------------------------------------------------------------ //

    function checkPoint(){
        $('[data-section-id]').each(function (event) {
            let start = $(this).offset().top;
            let end = start + $(this).outerHeight(true);
            let marker = $(document).scrollTop() + $(window).outerHeight(true) / 2;
            let id = $(this).attr('data-section-id');
            
            if(marker >= start && marker <= end)
                $('.points__item[data-point-id='+id+']').addClass('active');
            else
                $('.points__item[data-point-id='+id+']').removeClass('active');
        }); 
    }

    $('.points__item[data-point-id]').click(function(event){
		let id = $(this).attr('data-point-id');
        let section = $('[data-section-id='+id+']');

        if(!section)
            return;

        $('html, body').animate({
            scrollTop: section.offset().top - $('.nav').outerHeight(true)
        }, 500);
	});

    checkPoint();

    $(window).scroll(function (e) {
        checkPoint();
    });
    
});