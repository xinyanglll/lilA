# Little Apple — Process

## Concept and assignment

The project explores how a small action can produce an expressive visual and audible response. A user repeatedly selects or clicks a character, receives feedback, and can continue interacting. This addresses Assignment 3's input-response loop through a browser-based experience.

## Visual development

The student chose a small apple character and directed a series of revisions from low-poly character references: a broad apple shape, cream face, low-set closed eyes, a small mouth, one leaf, a short stem and soft lighting. A strongly pixelated version was rejected in favor of clear shapes with subtle surface texture. Four original expression images were selected: Sleepy, Teary, Happy and Grumpy.

An early prototype used a face overlay. Feedback was that the later expressions looked blurred. The implementation was revised to display the four original images directly, without synthetic expression overlays. CSS clips the exterior background and floor shadow. The lower-left clipping edge was refined after a remaining shadow was noticed.

## Interaction development

The main interaction cycles moods. Direct mood-selection buttons, sound replay, mute, reset and a hello counter make the state visible and give the user control. Each mood has its own caption, movement and short synthesized sound.

The music trigger developed from a framed music note into an unframed retro graphic, then a small white speech bubble retaining the supplied :3 emoticon. Feedback led to a smaller apple and a bubble positioned at its upper-left. A click-target problem was addressed by placing the revealed bubble above the apple button's transparent hit area.

## Sound and music

The student described a higher 440 Hz tone as sharper and a minor chord as somewhat sad during earlier sound exercises. The site uses code-generated effects to distinguish the moods, plus four short piano-like arrangements with different tempos, registers and harmony.

Longer house arrangements were explored separately in Strudel. The student rejected several versions as too rigid or unpleasant and supplied EASY LIFE by 4ETERNITY and GATE FAILURE 8745 by MLGHT as references. Those drafts have not been approved or integrated. A supplied reference recording was converted to MP3, but its musical content was not successfully analyzed by the available tools. The current website does not use that recording or those commercial tracks.

## AI assistance and references

Codex assisted with image generation and cutouts, JavaScript, CSS, synthesized audio, troubleshooting and documentation. The student supplied reference images, chose the character direction and four expressions, requested layout and interaction changes, and gave feedback on appearance and music. This process record was drafted with AI assistance; it is not presented as an independently written personal reflection.

Visual references included low-poly mascot screenshots, apple photographs, facial-expression examples, and retro music-note and speech-bubble graphics supplied during development. Their original creator information was not provided. The final character images are AI-generated renders; reference graphics should not be claimed as original drawings by the student.

## Verification and remaining manual checks

Browser checks on 29 October 2026 confirmed direct Happy and Grumpy selection, click cycling, bubble-triggered playback state, mute stopping playback, muted-playback guidance, reset to Sleepy with 0 HELLOS, and Enter-key activation of the apple. The narrow browser view displayed wrapped mood and playback controls without horizontal overflow in the inspected view. Playback-state verification is not a listening evaluation of audio quality. Desktop layout, Space/Tab navigation, replay, and tab-hiding still need final manual verification.

Source inspection confirms that the interface uses four original expression images, four short mood effects and four melody files. Strudel scores are separate from the runtime website. Audio is designed to stop on mood change, mute, reset and tab hiding.

Before submission, manually verify:

- Click through all four moods and select each directly.
- Play and stop a melody with both the bubble and the labeled button.
- Check sound replay, mute, reset and tab-hiding behavior.
- Check the layout at desktop and phone widths.
- Use Tab, Enter and Space to operate the controls.

These checks are pending final verification; no claim of a completed user study is made.


## lilA journal revision — 29 October 2026

The student felt the original interface was too simple and lacked a clear purpose. They chose the name lilA and specified a four-step flow: a home page, an apple mood-selection page, a sticky-note editor, and notes pinned to a calendar after saving. The site was revised around that instruction, retaining the chosen character assets and audio.

The journal stores dated entries with one of four moods in browser localStorage. Past-seven-day buttons provide a quick review; the calendar supports multiple notes per day, month navigation, reading, editing and deletion with confirmation. Export downloads a JSON backup. There is no login, cloud synchronization or JSON import. Notes are rendered as text, and a failed storage write leaves the editor open with an error message.

Browser verification used a clearly labeled temporary test note: Happy was selected, text was saved to 29 October, reloading retained the entry, editing updated its text without adding another entry, and confirmed deletion removed it from the calendar. The temporary entry was removed after testing. A narrow-width home view was visually inspected. Wider desktop layout and backup download need final manual verification. The new purpose and interaction flow were directed by the student; implementation and this process summary were assisted by Codex.


## Monochrome home-page direction

The student supplied a monochrome personal-portfolio screenshot with generous whitespace, narrow typography, an outlined wordmark and a pixel-style doodle. The home page adopts those visual qualities with lilA-specific copy and an original code-drawn SVG apple illustration. The supplied portfolio logo and character artwork were not copied. Color character assets remain in the mood-selection flow. The new entry button was verified to navigate to mood selection, and narrow-width views of the heading, entry and illustration were inspected.


## Unified print design — 1 November 2026

The student supplied three references: narrow black print typography, varied ink density on fibrous paper, and a red-bordered apple notepad. All screens now share paper grain, subtle displaced-ink lettering, narrow typography with contrasting weights and muted ink colors. The home page remains text-only and uses a centered composition. The note editor uses an original SVG apple-paper illustration with a stem, leaf, cream writing space and red edge; date and existing English copy remain. Four original SVG line-art apple expressions were drawn for calendar stamps. Each recorded day displays one stamp representing its latest entry; all notes for the day remain in the detail panel (beside the calendar on desktop, below it on narrow screens).

Browser verification saved a temporary note and confirmed a single Sleepy stamp in its date cell, with full text retained in the detail panel. The test note was removed afterwards. Mobile note positioning was adjusted after visual inspection. JavaScript syntax checks passed. The SVG texture and stamps were created as code-native graphics; no source reference screenshot was embedded in the interface.

### November 1 — distressed typewriter refinement
Replaced clean condensed typography with locally bundled Special Elite throughout all views and form controls. Removed italic styling, retained centered text-only home, and added original procedural paper fibers and grain. Verified the home, mood and note views in a narrow browser preview.

### November 1 — three additional feelings
Added Calm, Anxious and Tired, preserving original mood indexes for existing notes. Used built-in image generation to create transparent apple variants from the original character; added matching original SVG calendar stamps. Created three original additive-synthesis arrangements with warm rolled chords and distinct melodies (approximately 30, 21 and 37 seconds). Source: make_new_moods.py. Verified all three playback states, mood switching, and saving/reloading a Tired calendar entry; removed the temporary test note. Audio playback was checked through browser state, without an acoustic listening assessment.

Skin consistency correction: the three generated images changed surface texture. Their faces now render as softly masked layers over the exact original apple-happy.png body. The original red skin, silhouette, stem and leaf are reused rather than regenerated. Checked Calm, Anxious and Tired in the browser.

Expression correction: Calm, Anxious and Tired now reuse apple.png directly, keeping the original straight-line eyes and w-shaped mouth. Small code-native SVG accents distinguish blush, sweat and tired under-eye lines. The generated alternate facial images are no longer used at runtime. Matching calendar stamps were adjusted too.

Removed Sleepy as a selectable mood at student request. The first original expression is now Calm and uses the Calm arrangement. Removed the duplicate Calm selector, kept stored mood indexes stable, mapped former duplicate Calm notes to the first slot, and made cycling follow visible choices.

Refined Anxious to inward-rising original line eyes and the w mouth, with no sweat drop; masked the original tear locations using the calm face. Tired under-eye strokes now use opaque dark brown matching the facial features. Checked both in the browser.

Calendar scrapbook refinement: warm textured paper, three alternating uneven SVG grid-line patterns, subtle rotated doodle stamps with stronger ink displacement. Full note details and existing calendar interactions retained. Verified narrow calendar view.

Replaced pinned/curl note layers with single adhesive paper sheets, five irregular outlines, stable per-entry rotation and pale shadows. Fixed calendar stamps pointer-events:none that prevented the prior hover rule; enabled pointer response and 1.12 scale on stamp hover. Removed cell hover/selection fill. Visually checked a temporary saved note and removed it afterward.

## Final submission status and user trial

The final runtime has six moods: Calm, Teary, Happy, Grumpy, Anxious and Tired. Later corrections supersede the earlier prototype descriptions above. Calm has no blush; Tired under-eye strokes are softer. The calendar has hand-drawn lines, and notes are single adhesive sheets with varied outlines and light shadows.

A suggestion kept: develop the expression demo into a mood → note → calendar loop, giving the character interaction a useful purpose. A suggestion changed/rejected: regenerated emotional faces and a folded-note shadow were rejected because they broke the character style or looked like unwanted paper layers. Original line eyes and w mouth were retained, and the note treatment was simplified.

The student’s design feedback and automated/browser checks are not an independent participant trial. The student subsequently reported feedback from a classmate who tried the site on a phone; see the participant trial below. The student did not report whether instructions were given beforehand, or describe a directly observed hesitation, so those details are not claimed.

Development history: the process above records earlier local iterations. The dedicated public repository was created on November 1, with separate real commits for source/documentation, artwork/audio, the font/license, and the screenshot. These upload commits do not reconstruct or backdate the earlier local history.

Public deployment: GitHub Pages serves https://xinyanglll.github.io/lilA/ . A signed-out browser could access the public repository and website. The deployed mood page loaded its character and speech-bubble assets; the Anxious melody entered playback with no captured browser errors. The classmate feedback and resulting localization correction are recorded below.

Mobile localization correction: the student reported Chinese date text on a phone. Replaced the native date field with explicit English month/day/year selectors; invalid month-end days are clamped to the selected month. Verified selecting February and November locally. The student later confirmed that this issue was reported by a classmate during testing.

## Participant trial — mobile date localization

**Feedback reported by the student:** a classmate tried lilA on a phone and noticed that the date in the note editor appeared in Chinese, although the website is designed in English. No identifying information about the classmate is included.

**Decision and improvement:** the native HTML date control inherited the device/browser locale. Setting the page language alone did not ensure an English date display. It was replaced with explicit English month, numeric day and year selectors. This makes the displayed date consistent with the rest of the interface while retaining date selection and the same stored ISO date. When the user changes months, the day list updates and an out-of-range day is clamped to the last valid day.

**Verification and limits:** browser checks confirmed English month labels and selection across February and November. A follow-up check by the classmate on the original phone has not yet been reported. The available feedback does not establish whether the classmate received instructions before trying the website; no such claim is made.
