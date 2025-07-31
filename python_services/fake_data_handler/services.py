from faker import Faker

def generate_fake_data(data_type, count, locale='en_US', schema=None):
    """
    Generates a list of fake data.
    If a custom schema is provided, it's used. Otherwise, falls back to preset data types.
    """
    fake = Faker(locale)
    data = []

    # Ensure count is a reasonable number
    try:
        count = int(count)
        if not (0 < count <= 500): # Set a reasonable limit
            count = 10
    except (ValueError, TypeError):
        count = 10

    for _ in range(count):
        if data_type == 'custom' and schema and isinstance(schema, list):
            # --- Custom Schema Generation ---
            record = {}
            for field in schema:
                field_name = field.get('fieldName')
                field_type = field.get('fieldType')
                if field_name and hasattr(fake, field_type):
                    record[field_name] = getattr(fake, field_type)()
            data.append(record)

        else:
            if data_type == 'personal':
                data.append({
                    'name': fake.name(),
                    'email': fake.email(),
                    'address': fake.address().replace('\n', ', '),
                    'phone_number': fake.phone_number(),
                })
            elif data_type == 'business':
                data.append({
                    'company': fake.company(),
                    'job_title': fake.job(),
                    'catch_phrase': fake.catch_phrase(),
                })
            elif data_type == 'finance':
                data.append({
                    'credit_card_number': fake.credit_card_number(),
                    'credit_card_provider': fake.credit_card_provider(),
                    'currency_code': fake.currency_code(),
                })
            else:
                # If a non-custom, unsupported type is passed, return an error.
                return {"Error": f"Unsupported data type: {data_type}"}

    return data