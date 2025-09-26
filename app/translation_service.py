import random
import re
from app.schemas import TranslationRule


class TranslationService:
    def __init__(self):
        self.translation_rules = self._load_translation_rules()
        self.emoji_meanings = self._load_emoji_meanings()

    def _load_translation_rules(self):
        """Load predefined translation rules for emoji sequences"""
        # AI generated rules for translating emoji sequences to narratives
        return [
            # Animals and food
            TranslationRule(
                pattern=["🐱", "🐟"],
                templates=[
                    "The cat spotted its favorite meal",
                    "Feline fishing adventures begin",
                    "A hungry cat eyes the perfect catch",
                ],
            ),
            TranslationRule(
                pattern=["🐶", "🦴"],
                templates=[
                    "The dog found the ultimate treasure",
                    "Puppy discovers bone paradise",
                    "A good boy gets his reward",
                ],
            ),
            # Weather and activities
            TranslationRule(
                pattern=["🏃", "🌧️"],
                templates=[
                    "Someone ran from the rain",
                    "Quick dash through the storm",
                    "Racing against nature's shower",
                ],
            ),
            TranslationRule(
                pattern=["☀️", "🏖️"],
                templates=[
                    "Perfect beach day vibes",
                    "Sun meets sand in harmony",
                    "Paradise found under golden rays",
                ],
            ),
            # Romance and emotions
            TranslationRule(
                pattern=["💕", "😍"],
                templates=[
                    "Love is in the air",
                    "Hearts flutter with joy",
                    "Cupid strikes again",
                ],
            ),
            TranslationRule(
                pattern=["😢", "🌈"],
                templates=[
                    "After tears comes beauty",
                    "Sadness transforms into hope",
                    "The storm passes, revealing wonder",
                ],
            ),
            # Food adventures
            TranslationRule(
                pattern=["🍕", "😋"],
                templates=[
                    "Pizza brings pure joy",
                    "Cheesy happiness delivered",
                    "The perfect slice of heaven",
                ],
            ),
            TranslationRule(
                pattern=["🍰", "🎉"],
                templates=[
                    "Celebration calls for cake",
                    "Sweet moments deserve sweetness",
                    "Party time with sugary delights",
                ],
            ),
            # Technology and modern life
            TranslationRule(
                pattern=["📱", "😴"],
                templates=[
                    "Late-night scrolling session",
                    "Digital world meets dreamland",
                    "Phone addiction strikes again",
                ],
            ),
            TranslationRule(
                pattern=["💻", "☕"],
                templates=[
                    "Coding fuel activated",
                    "Productivity powered by caffeine",
                    "The developer's essential combo",
                ],
            ),
            # Travel and adventure
            TranslationRule(
                pattern=["✈️", "🗺️"],
                templates=[
                    "Adventure awaits somewhere new",
                    "Wings carry dreams to distant lands",
                    "The journey begins with a single flight",
                ],
            ),
            TranslationRule(
                pattern=["🚗", "🛣️"],
                templates=[
                    "Road trip vibes activated",
                    "Freedom found on the highway",
                    "Four wheels and endless possibilities",
                ],
            ),
            # Seasonal patterns
            TranslationRule(
                pattern=["🎃", "👻"],
                templates=[
                    "Spooky season is here",
                    "Halloween magic fills the air",
                    "Ghosts and gourds unite",
                ],
            ),
            TranslationRule(
                pattern=["🎄", "🎁"],
                templates=[
                    "Christmas magic unfolds",
                    "Holiday joy wrapped with love",
                    "Festive spirit brings surprises",
                ],
            ),
            # Success and achievement
            TranslationRule(
                pattern=["🏆", "🎊"],
                templates=[
                    "Victory tastes sweet",
                    "Champions celebrate in style",
                    "Success deserves confetti",
                ],
            ),
            TranslationRule(
                pattern=["💪", "🔥"],
                templates=[
                    "Strength meets determination",
                    "Power ignites inner fire",
                    "Unstoppable force activated",
                ],
            ),
        ]

    def _load_emoji_meanings(self) -> dict[str, list[str]]:
        """Load basic meanings for common emojis"""
        # AI generated basic meanings for common emojis
        return {
            # People and emotions
            "😀": ["happiness", "joy", "smile"],
            "😢": ["sadness", "tears", "sorrow"],
            "😍": ["love", "adoration", "heart eyes"],
            "😴": ["sleep", "tired", "rest"],
            "😋": ["delicious", "yummy", "tasty"],
            "🤔": ["thinking", "pondering", "confused"],
            "😎": ["cool", "awesome", "confident"],
            # Animals
            "🐱": ["cat", "kitty", "feline"],
            "🐶": ["dog", "puppy", "canine"],
            "🦄": ["unicorn", "magic", "fantasy"],
            "🐸": ["frog", "amphibian", "green"],
            "🦋": ["butterfly", "transformation", "beauty"],
            # Nature
            "🌳": ["tree", "nature", "forest"],
            "🌸": ["flower", "spring", "bloom"],
            "🌙": ["moon", "night", "celestial"],
            "⭐": ["star", "shine", "twinkle"],
            "🌈": ["rainbow", "colorful", "hope"],
            "☀️": ["sun", "bright", "warm"],
            "🌧️": ["rain", "wet", "storm"],
            # Food
            "🍕": ["pizza", "cheesy", "Italian"],
            "🍰": ["cake", "sweet", "dessert"],
            "☕": ["coffee", "caffeine", "energy"],
            "🍔": ["burger", "fast food", "hungry"],
            "🍓": ["strawberry", "berry", "sweet"],
            # Objects
            "📱": ["phone", "mobile", "technology"],
            "💻": ["laptop", "computer", "work"],
            "🚗": ["car", "vehicle", "transport"],
            "✈️": ["airplane", "travel", "flight"],
            "🏠": ["house", "home", "shelter"],
            # Activities
            "🏃": ["running", "exercise", "fast"],
            "🎮": ["gaming", "play", "fun"],
            "📚": ["books", "reading", "study"],
            "🎵": ["music", "melody", "song"],
            "🎨": ["art", "creative", "painting"],
        }

    def translate(self, emoji_sequence: list[str]) -> str:
        """Translate a sequence of emojis into a narrative"""
        if not emoji_sequence:
            return "No emojis provided."

        translation = self.match_rules(emoji_sequence)
        if translation:
            return translation

        return self._create_narrative_from_emojis(emoji_sequence)

    def match_rules(self, emoji_sequence: list[str]) -> str | None:
        """Check if the emoji sequence matches any predefined rules"""
        for rule in self.translation_rules:
            if self.contains_pattern(emoji_sequence, rule.pattern):
                return rule.templates[0]
        return None

    def contains_pattern(self, emoji_sequence: list[str], pattern: list[str]) -> bool:
        """Check if the emoji sequence contains the given pattern"""
        if len(pattern) > len(emoji_sequence):
            return False

        for i in range(len(emoji_sequence) - len(pattern) + 1):
            if emoji_sequence[i : i + len(pattern)] == pattern:
                return True

        pattern_copy = pattern.copy()
        for emoji in emoji_sequence:
            if emoji in pattern_copy:
                pattern_copy.remove(emoji)
            if not pattern_copy:
                return True

        return len(pattern_copy) == 0

    def _create_narrative_from_emojis(self, emoji_sequence: list[str]) -> str:
        """Create a narrative by translating individual emojis"""
        story_parts = []

        for emoji in emoji_sequence:
            if emoji in self.emoji_meanings:
                meaning = random.choice(self.emoji_meanings[emoji])
                story_parts.append(meaning)
            else:
                # Fallback for unknown emojis
                story_parts.append(f"something mysterious ({emoji})")

        # Create different narrative structures
        if len(story_parts) == 1:
            return f"A tale of {story_parts[0]}."
        elif len(story_parts) == 2:
            return f"{story_parts[0].capitalize()} meets {story_parts[1]}."
        elif len(story_parts) == 3:
            return f"Once upon a time, {story_parts[0]} encountered {story_parts[1]} and discovered {story_parts[2]}."
        else:
            # For longer sequences, create a more complex narrative
            beginning = f"Our story begins with {story_parts[0]}"
            middle_parts = story_parts[1:-1]
            ending = story_parts[-1]

            if middle_parts:
                middle = f", followed by {', '.join(middle_parts)}"
                return f"{beginning}{middle}, and finally {ending}."
            else:
                return f"{beginning} and {ending}."

    def get_story_themes(self, emoji_sequence: list[str]) -> list[str]:
        """Extract themes from the emoji story"""
        themes = set()

        for emoji in emoji_sequence:
            if emoji in self.emoji_meanings:
                themes.update(self.emoji_meanings[emoji])

        return list(themes)

    def validate_emoji_sequence(self, emoji_sequence: list[str]) -> bool:
        """Validate that the sequence contains actual emojis"""
        emoji_pattern = re.compile(
            "["
            "\U0001f600-\U0001f64f"  # emoticons
            "\U0001f300-\U0001f5ff"  # symbols & pictographs
            "\U0001f680-\U0001f6ff"  # transport & map symbols
            "\U0001f700-\U0001f77f"  # alchemical symbols
            "\U0001f780-\U0001f7ff"  # geometric shapes extended
            "\U0001f800-\U0001f8ff"  # supplemental arrows-c
            "\U0001f900-\U0001f9ff"  # supplemental symbols and pictographs
            "\U0001fa00-\U0001fa6f"  # chess symbols
            "\U0001fa70-\U0001faff"  # symbols and pictographs extended-a
            "\U0001f1e0-\U0001f1ff"  # flags (iOS)
            "\U00002702-\U000027b0"
            "\U000024c2-\U0001f251"
            "]+",
            flags=re.UNICODE,
        )

        for emoji in emoji_sequence:
            if not emoji_pattern.match(emoji):
                return False

        return True
