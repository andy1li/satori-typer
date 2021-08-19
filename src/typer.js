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
    $('#typer .free-typing').map(function() { 
        return $(this).val()} 
    )
);

function checkCorrect(textArea, sentence) {
    if ($(textArea).val().trim() === sentence) {
        $(textArea).next().addClass('correct-sentence');
    } else {
        $(textArea).next().removeClass('correct-sentence');
    }
}

function sentenceHTML(sentence, audio, idx, width) {
    style = `style="width: ${width}px; height: ${8 + 60 * Math.ceil(sentence.length * 24 / width)}px"`;
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
    $('#typer .free-typing').each(function(idx) {
        // Read from Local Stroage
        $(this).val(store[idx]);
        const sentence = sentencesWithAudios[idx].sentence
        checkCorrect(this, sentence);

        // Write to Local Stroage
        $(this).bind('input propertychange', () => {
            localStorage.setItem(episode, JSON.stringify(allTextVals()));
            checkCorrect(this, sentence);
        })
        
        // Audio with focus and click
        $(this).focus(playAudio);
        $(this).click(playAudio);
        $(this).prev().click(function() {
            // prevent infinite loop
            $(this).next().unbind('focus');
            $(this).next().focus();
            $(this).next().bind('focus', playAudio);
        })

        // key managment
        $(this).on("keydown", function(e) {
            const key = e.which;

            // enter to tab
            if (key == 13) {
                e.preventDefault();
                const tas = $(this).closest('div').find('.free-typing');
                tas.eq( tas.index(this) + 1 ).focus();
            }

            // left and right
            if (key == 37 || key == 39) e.stopPropagation();
        });
    });
};

const readingMode = '📖 Reading Mode';
const typingMode = '🎹 Typing Mode';
const toggleButtonHTML = `
    <div id="typer-toggle" style="margin-top: 15px">
        <span class="tooltip-button tooltip-button-active">${readingMode}</span>
    </div>
`;

function setupToggle() {
    $('.article-header-image').after(toggleButtonHTML);
    $('#typer-toggle').click(function() {
        $('.article').toggle()
        $('#typer-toggle span').text((_, text) => 
            text == readingMode ? typingMode : readingMode
        );
    });
};

$(() => {
    setupSentences();
    setupToggle();
});