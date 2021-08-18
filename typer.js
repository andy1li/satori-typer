const allSentences = () => Array.from(
    $('#article-content')
        .find('.paragraph.body .sentence')
        .map(function(){
            return $(this).find('.wpt, .nw').text()
        })
);

function sentenceHTML(sentence, idx, width) {
    style = `style="width: ${width}px; height: ${60 * Math.ceil(sentence.length * 24 / width)}px"`;
    return `
        <span class="paragraph body" ${style}>
            <span class="sentence">
                <span class="container">
                    <span class="sentence-number">${idx + 1}.</span>
                    <span class="play-button-container"><span class="play-button play-button-standard noselect" onclick="router.route('RouteObjID_1000', function(event) { this.playSentenceClicked(event, 'SmTWrScNGosUBIKSoePp'); }, event);">▶️</span></span>
                    <textarea class="free-typing" tabindex="${idx + 1}" ${style}></textarea>
                    <textarea tabindex=0 placeholder="${sentence}" ${style}></textarea>
                </span>
            </span>
        </span>
    `;
}
    
function setupSentences() {
    $('#article-content').append('<div id="typer" class="article"></div>');
    $('#typer').hide()
    
    const width = $('#article-content').width() - 80;
    allSentences().forEach((sentence, idx) =>  
        $('#typer').append(
            sentenceHTML(sentence, idx, width)
        )
    );
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