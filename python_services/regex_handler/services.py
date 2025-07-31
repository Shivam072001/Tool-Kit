# python_services/regex_handler/services.py

import re

def test_regex(pattern, test_string, flavor, flags):
    """
    Tests a regular expression pattern against a string using a specified flavor.
    Currently, only 'python' (PCRE-compatible) flavor is implemented.
    """
    if flavor.lower() != 'python':
        # In a real-world scenario, you might have different handlers for different flavors.
        raise ValueError(f"Unsupported regex flavor: {flavor}")

    try:
        # Map frontend flags to Python's `re` module flags
        re_flags = 0
        if 'i' in flags:
            re_flags |= re.IGNORECASE
        if 'm' in flags:
            re_flags |= re.MULTILINE

        # Find all matches with their start and end positions
        matches = [
            {"start": match.start(), "end": match.end(), "text": match.group(0)}
            for match in re.finditer(pattern, test_string, flags=re_flags)
        ]

        return {"matches": matches, "error": None}

    except re.error as e:
        # Return a structured error if the regex pattern is invalid
        return {"matches": [], "error": str(e)}