/**
 * PasswordStrength component
 * Displays password strength indicator with visual feedback
 * WCAG 2.1 AA compliant
 */
const PasswordStrength = ({ password }) => {
  /**
   * Calculate password strength
   * Returns: { score: 0-4, label: string, color: string }
   */
  const calculateStrength = (pwd) => {
    if (!pwd) {
      return { score: 0, label: '', color: '' };
    }

    let score = 0;

    // Length check
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;

    // Complexity checks
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++; // Mixed case
    if (/\d/.test(pwd)) score++; // Contains number
    if (/[^a-zA-Z0-9]/.test(pwd)) score++; // Contains special char

    // Cap at 4
    score = Math.min(score, 4);

    const strengthLevels = {
      0: { label: '', color: '' },
      1: { label: 'Weak', color: 'bg-red-500' },
      2: { label: 'Fair', color: 'bg-orange-500' },
      3: { label: 'Good', color: 'bg-yellow-500' },
      4: { label: 'Strong', color: 'bg-green-500' },
    };

    return { score, ...strengthLevels[score] };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2" role="status" aria-live="polite">
      {/* Strength bars */}
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              level <= strength.score ? strength.color : 'bg-gray-200'
            }`}
            aria-hidden="true"
          ></div>
        ))}
      </div>

      {/* Strength label */}
      {strength.label && (
        <p className="text-xs text-gray-600">
          Password strength: <span className="font-medium">{strength.label}</span>
        </p>
      )}

      {/* Requirements hint */}
      {strength.score < 3 && (
        <ul className="mt-2 text-xs text-gray-600 space-y-1">
          <li className="flex items-center gap-1">
            <span className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
              {password.length >= 8 ? '✓' : '○'}
            </span>
            At least 8 characters
          </li>
          <li className="flex items-center gap-1">
            <span className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
              {/[a-z]/.test(password) && /[A-Z]/.test(password) ? '✓' : '○'}
            </span>
            Mixed case letters
          </li>
          <li className="flex items-center gap-1">
            <span className={/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}>
              {/\d/.test(password) ? '✓' : '○'}
            </span>
            At least one number
          </li>
          <li className="flex items-center gap-1">
            <span className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
              {/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'}
            </span>
            Special character (!@#$%^&*)
          </li>
        </ul>
      )}
    </div>
  );
};

export default PasswordStrength;
