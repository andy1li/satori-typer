const allSentencesWithAudios = () => Array.from(
    $('#article-content .paragraph.body .sentence')
        .map(function(){
            return {
                sentence: $(this).find('.wpt, .nw').text(), 
                audio: $(this).attr('data-id')
            };
        })
);

const allTextVals = () => Array.from(
    $('.free-typing').map(function() { 
        return $(this).val()} 
    )
);

function isCorrect(textArea, sentence) {
    if ($(textArea).val().trim() === sentence) {
        $(textArea).next().addClass('correct-sentence');
    } else {
        $(textArea).next().removeClass('correct-sentence');
    }
}

function sentenceHTML(sentence, audio, idx, width) {
    style = `style="width: ${width}px; height: ${60 * Math.ceil(sentence.length * 24 / width)}px"`;
    return `
        <span class="paragraph body" ${style}>
            <span class="sentence">
                <span class="container">
                    <span class="sentence-number">${idx + 1}.</span>
                    <span class="play-button-container"><span class="play-button play-button-standard noselect" onclick="router.route('RouteObjID_1000', function(event) { this.playSentenceClicked(event, '${audio}'); }, event);">▶️</span></span>
                    <textarea class="free-typing" tabindex="${idx + 1}" ${style}></textarea>
                    <textarea tabindex=0 placeholder="${sentence}" ${style}></textarea>
                </span>
            </span>
        </span>
    `;
}

function playAudio() {
    $(this).prev().children().trigger('click');
}

function setupSentences() {
    const episode = window.location.pathname;
    const sentencesWithAudios = allSentencesWithAudios()
    $('#article-content').append('<div id="typer" class="article"></div>');
    $('#typer').hide()
    
    const width = $('#article-content').width() - 80;
    sentencesWithAudios.forEach(({sentence, audio}, idx) => 
        $('#typer').append(
            sentenceHTML(sentence, audio, idx, width)
        )
    );

    const store = JSON.parse(localStorage.getItem(episode)) || [];
    $('#article-content .free-typing').each(function(idx) {
        $(this).val(store[idx]);
        const sentence = sentencesWithAudios[idx].sentence
        isCorrect(this, sentence);

        $(this).bind('input propertychange', () => {
            localStorage.setItem(episode, JSON.stringify(allTextVals()));
            isCorrect(this, sentence);
        })

        $(this).focus(playAudio);
        $(this).click(playAudio);
        $(this).prev().click(function() {
            $(this).next().unbind('focus');
            $(this).next().focus();
            $(this).next().bind('focus', playAudio);
        })
    });
};

const readingMode = '📖 Reading Mode';
const typingMode = '🎹 Typing Mode';
const toggleButtonHTML = `
    <div id="typer-toggle" style="margin-top: 15px">
        <span class="tooltip-button tooltip-button-active">${readingMode}</span>
    </div>
`;

function toggle() {
    $('.article').toggle()
    $('#typer-toggle span').text((_, text) => 
        text == readingMode ? typingMode : readingMode
    );
}

function enterToTab(e) {
    const key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    if (key == 13) {
        e.preventDefault();
        const ts = $(this).closest('div').find('.free-typing');
        ts.eq( ts.index(this) + 1 ).focus();
    }
};

function setupToggle() {
    $('.article-header-image').after(toggleButtonHTML);
    $('#typer-toggle').click(toggle);
    $('textarea').on("keypress", enterToTab);
};

$(() => {
    setupSentences();
    setupToggle();
});